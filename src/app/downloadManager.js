angular.module('downloadManager', [])

.factory('downloadManager', ['$http', '$q', function($http, $q){
    return {
        /*
         * @param {string} suid     Study UID
         * @param {string} set      AE Title
         * @return promise
        */
        getStudies: function(aet, suid){
            return $http.get('/wado/getstudies', {params: {aet: aet, suid: suid}});
        },
        downloadSeries: function(urls){
            var d = $q.defer();
            var promises = [];
            for(var i = 0; i < urls.length; i++){
                var url = urls[i];
                var p = $http.get(url, {responseType: "arraybuffer"});
                promises.push(p);
            };
            $q.all(promises).then(function(result){
                d.resolve(result);
            }, function(rejection){
                d.reject(rejection);
            });
            return d.promise;
        }
    }
}]);