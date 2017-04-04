define([
    'dojo/Deferred'
], (
    Deferred
) => {
    return {
        options: {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        },
        promise: new Deferred(),
        getCurrentPosition(navigator) {
            console.info('app/Geolocation:getCurrentPosition');

            if (this.promise.isFulfilled()) {
                this.promise = new Deferred();
            }

            if (!navigator.geolocation) {
                console.warn('Geolocation is not supported.');
                this.promise.reject('Geolocation is not supported');

                return this.promise;
            }

            navigator.geolocation.getCurrentPosition(
                    (pos) => this.success(pos, this.promise),
                    (err) => this.error(err, this.promise),
                    this.options
            );

            return this.promise;
        },
        success: (position, promise) => promise.resolve(position),
        error: (err, promise) => promise.reject(err)
    };
});
