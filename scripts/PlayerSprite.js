function PlayerSprite(params) {
    PIXI.extras.MovieClip.call(this, params);
}

PlayerSprite.prototype = Object.create(PIXI.extras.MovieClip.prototype);
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.prototype.someOtherFunction = function() {};

PlayerSprite.prototype.loopStart = null;
PlayerSprite.prototype.loopEnd = null;
PlayerSprite.prototype.isRange = false;

Object.defineProperties(PlayerSprite.prototype, {
    /**
    * The MovieClips current frame index
    *
    * @member {number}
    * @memberof PIXI.extras.MovieClip#
    * @readonly
    */
    currentFrame: {
        get: function ()
        {
            if (!this.isRange) {
                var currentFrame = Math.floor(this._currentTime) % this._textures.length;
                if (currentFrame < 0)
                {
                    currentFrame += this._textures.length;
                }
                return currentFrame;
            }
            else {
                var currentFrame = this.loopStart + Math.floor(this._currentTime) % (this.loopEnd - this.loopStart);
                if (currentFrame < this.loopStart)
                {
                    currentFrame += this.loopEnd - this.loopStart;
                }
                return currentFrame;
            }
        }
    }

});

PlayerSprite.prototype.gotoAndPlay = function (frameNumber)
{
    this.isRange = false;

    this._currentTime = frameNumber;

    this.play();
};

PlayerSprite.prototype.gotoAndStop = function (frameNumber)
{
    this.isRange = false;

    this.stop();

    this._currentTime = frameNumber;

    this._texture = this._textures[this.currentFrame];
};

PlayerSprite.prototype.playRange = function (start, end)
{
    this.isRange = true;
    this.loopStart = start;
    this.loopEnd = end;
    
    this._currentTime = start;

    this.play();
};

PlayerSprite.prototype.update = function (deltaTime)
{
    var elapsed = this.animationSpeed * deltaTime;

    if (this._durations !== null)
    {
        var lag = this._currentTime % 1 * this._durations[this.currentFrame];

        lag += elapsed / 60 * 1000;

        while (lag < 0)
        {
            this._currentTime--;
            lag += this._durations[this.currentFrame];
        }

        var sign = Math.sign(this.animationSpeed * deltaTime);
        this._currentTime = Math.floor(this._currentTime);

        while (lag >= this._durations[this.currentFrame])
        {
            lag -= this._durations[this.currentFrame] * sign;
            this._currentTime += sign;
        }

        this._currentTime += lag / this._durations[this.currentFrame];
    }
    else
    {
        this._currentTime += elapsed;
    }

    if (this.isRange) {
        if (this._currentTime < this.loopStart && !this.loop)
        {
            this.gotoAndStop(this.loopStart);

            if (this.onComplete)
            {
                this.onComplete();
            }
        }
        else if (this._currentTime >= this.loopEnd && !this.loop)
        {
            this.gotoAndStop(this.loopEnd);

            if (this.onComplete)
            {
                this.onComplete();
            }
        }
        else
        {
            this._texture = this._textures[this.currentFrame];
        }
    }
    else {
        if (this._currentTime < 0 && !this.loop)
        {
            this.gotoAndStop(0);

            if (this.onComplete)
            {
                this.onComplete();
            }
        }
        else if (this._currentTime >= this._textures.length && !this.loop)
        {
            this.gotoAndStop(this._textures.length - 1);

            if (this.onComplete)
            {
                this.onComplete();
            }
        }
        else
        {
            this._texture = this._textures[this.currentFrame];
        }
    }
};