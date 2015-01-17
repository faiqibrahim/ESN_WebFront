/**
 * Created by Ibrahim on 1/15/2015.
 */
angular.module('esn')
    .controller('InboxController', function ($scope, $http) {
        $scope.data = {};
        $scope.data.view = './views/inbox/inbox.html';
        $scope.updateView = function (view) {
            if (view == 'Inbox') {
                $scope.data.view = './views/inbox/inbox.html';
            }

        };


    })
    .controller('InboxMenuController', function ($scope) {
        var $menus = ['Inbox'];
        var $selectedMenu = $menus[0];
        $scope.data = {};
        $scope.data.menus = $menus;

        $scope.selectMenu = function (index) {
            if (index >= 0 && index < $scope.data.menus.length) {
                $selectedMenu = $scope.data.menus[index];
                $scope.updateView($selectedMenu);
            }
        };
        $scope.getActiveClass = function (menu) {
            return menu == $selectedMenu ? 'active' : '';
        };
    }).controller('InboxSummaryController', function ($scope, $http) {
        $scope.loadingSummary = false;
        $scope.messagesSummary = {};

        var loadData = function () {
            $scope.loadingSummary = true;
            $http.get('http://esnback.com/chats/getSummary.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.messagesSummary = data.result.summary;
                        $scope.loadingSummary = false;
                    } else {
                        console.log(data);
						$scope.loadingSummary = false;
                    }
                    console.log(data);
                }).error(function (error) {
                    console.log(error);
                });
        };
        loadData();


    }).controller('ChatBoxController', function ($scope, $interval, $http, $Auth, $routeParams, $location, $anchorScroll) {
        $scope.chat = {
            Chat: {},
            Message: [],
            User: []
        };
        $scope.loadingMessages = false;
        $scope.sendingMessage = false;
        $scope.user = {};
        $scope.contact = {};
        var previousReference = {};
        var getContactId = function ($users) {
            var id1 = $users[0]['id'];
            var id2 = $users[1]['id'];
            if (id1 == $Auth.getUser('id')) {
                $scope.user = $users[0];
                $scope.contact = $users[1];
                return id2;
            }
            else if (id2 == $Auth.getUser('id')) {
                $scope.user = $users[1];
                $scope.contact = $users[0];
                return id1;
            } else {
                return null;
            }
        };
        var interval_id = window.setInterval(function () {
            var elem = angular.element('#my-scroll')[0];
            elem.scrollTop = elem.scrollHeight;
        }, 2000);

        var reScroll = true;
        angular.element('#my-scroll').scroll(function () {
            clearInterval(interval_id);
            if (reScroll) {
                $scope.$broadcast('rebuild:scrollbar');
                reScroll=false;
            }

        });


        $scope.$on('rebuild:scrollbar', function () {
            var elem = angular.element('#my-scroll')[0];
            elem.scrollTop = elem.scrollHeight;
        });

        $scope.getUser = function ($id) {
            return $id == $Auth.getUser('id') ? $scope.user : $scope.contact;
        };
        var $contact_id = null;
        var loadChat = function () {
            $scope.loadingMessages = true;
            $http.post('http://esnback.com/chats/getchat/' + $routeParams.contactId + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.chat = data.result.chat;
                        $contact_id = getContactId($scope.chat.User);
                        $scope.loadingMessages = false;
                        $scope.$broadcast('rebuild:scrollbar');
                        if ($scope.chat.Message.length != 0) {
                            previousReference = $scope.chat.Message[0];
                        }
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                }).finally(function () {
                    $scope.$broadcast('rebuild:scrollbar');
                });

        };
        loadChat();

        $scope.sendMessage = function () {
            var $message = $scope.new_message;
            $scope.sendingMessage = true;
            if ($contact_id != null) {
                var $formData = {
                    Message: {
                        message: $message,
                        contact_id: $contact_id
                    }
                };
                $http.post('http://esnback.com/chats/addMessage.json', $formData, {withCredentials: true})
                    .success(function (data) {
                        if (data.result.success) {
                            $scope.chat.Message.push(data.result.Message);
                            $scope.new_message = '';
                            $scope.$broadcast('rebuild:scrollbar');
                            reScroll=true;
                            if ($scope.chat.Message.length != 0) {
                                previousReference = $scope.chat.Message[0];
                            }
                            $scope.sendingMessage = false;

                        } else {
                            console.log(data);
                        }
                    }).error(function (error) {
                        console.log(error);
                    });
            } else {
                console.log('Cannot send request with null');
            }
        };
        var _loadNext = true;
        $interval(function () {
            var $formData = {
                Chat: $scope.chat.Chat,
                Message: {
                    last_message: $scope.chat.Message[$scope.chat.Message.length - 1]
                }
            };
            if (angular.isUndefined($formData.Message.last_message)) {
                $formData.Message.last_message = {
                    id: 0
                }
            }
            if (_loadNext) {
                _loadNext = false;
                $http.post('http://esnback.com/chats/loadNext.json', $formData, {withCredentials: true})
                    .success(function (data) {

                        if (data.result.success) {
                            var $messages = data.result.messages;
                            for (var i = 0; i < $messages.length; i++) {
                                $scope.chat.Message.push($messages[i]);
                            }
                            _loadNext = true;
                            $scope.loadingMessages = false;
                        } else {
                            _loadNext = true;
                        }
                    }).error(function (error) {
                        console.log(error);
                    });
            }

        }, 3000);
        $scope.loadPrevious = function () {
            var $formData = {
                Chat: $scope.chat.Chat,
                Message: {
                    last_message: previousReference
                }
            };
            if (angular.isUndefined($formData.Message.last_message)) {
                $formData.Message.last_message = {
                    id: 0
                }
            }
            $http.post('http://esnback.com/chats/loadPrevious.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        var $messages = data.result.messages;
                        for (var i = 0; i < $messages.length; i++) {
                            $scope.chat.Message.unshift($messages[i]);
                        }
                        $scope.loadingMessages = false;
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }
        ;
        $scope.deleteMessage = function ($message_id, $index) {

            $http.delete('http://esnback.com/chats/deleteMessage/' + $message_id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.chat.Message.splice($index, 1);
                        $scope.loadingMessages = false;
                        if ($scope.chat.Message.length != 0) {
                            previousReference = $scope.chat.Message[0];
                        }
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }
        ;

    })
    .filter('sortByDate', function () {
        return function (data) {
            for (var i = 1; i < data.length; i++) {
                for (var k = i; k > 0 && data[k]['Chat']['modified'] > data[k - 1]['Chat']['modified']; k--) {
                    var temp = data[k];
                    data[k] = data[k - 1];
                    data[k - 1] = temp;
                }

            }
            return data;
        }
    })
;