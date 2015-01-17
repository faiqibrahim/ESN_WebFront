/**
 * Created by Ibrahim on 12/13/2014.
 */
angular.module('esn')
    .controller('CreateGroupCtrl', function ($scope, $http, $location) {
        $scope.form = {};
        $scope.form.privacy = 1;
        $scope.form.interests = [];
        $scope.form.selectedInterest = null;
        $scope.test = function () {
            console.log('testing');
        };
        $scope.addInterest = function () {
            if (!angular.isUndefined($scope.form.selectedInterest) && $scope.form.selectedInterest != null) {
                var $interest = $scope.form.selectedInterest.originalObject;
                console.log($interest.Interest);
                $scope.form.interests.push($interest.Interest);
            }
        };
        var getInterestsIdArray = function () {
            var result = [];
            for (var i = 0; i < $scope.form.interests.length; i++) {
                result.push($scope.form.interests[i].id);
            }
            return result;
        };
        var getFormJson = function () {

            return {
                Group: {
                    title: $scope.form.title,
                    description: $scope.form.description,
                    groupprivacy_id: $scope.form.privacy

                },
                Interest: getInterestsIdArray()
            };
        };
        $scope.create_group = function () {
            var $formData = getFormJson();
            $http.post('http://esnback.com/groups/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    console.log(data);
                    if (data.result.success) {
                        $location.path('/group/' + data.result.group_id);
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        };

    }).controller('GroupController', function ($scope, $http, $routeParams, $Auth) {

        $scope.groupOwner = false;
        $scope.groupJoined = false;
        $scope.groupLoading = false;
        $scope.owner = {};
        $scope.Group = {};
        $scope.authInfoLoading = false;
        $scope.groupRequested = false;
        $scope.groupLoaded = {};
        $scope.groupNotJoined = true;

        //load Group Data
        var getAuthInfo = function () {
            $scope.authInfoLoading = true;
            return $http.get('http://esnback.com/groups/getUserInfo/' + $routeParams.groupId + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        if (data.result.group_owner) {
                            $scope.owner = data.result.group_owner;
                            $scope.groupOwner = true;
                            $scope.groupNotJoined = false;

                        } else if (data.result.group_joined) {
                            $scope.groupJoined = true;
                            $scope.groupNotJoined = false;

                        } else if (data.result.group_requested) {
                            $scope.groupRequested = true;
                        }
                        $scope.authInfoLoading = false;
                        $scope.Group = data.result.group;
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        var _load = function () {
            $scope.groupLoaded = getAuthInfo();

        };
        _load();


        $scope.data = {};
        $scope.data.view = './views/group/announcements.html';
        $scope.updateView = function (view) {
            if (view == 'Announcements') {
                $scope.data.view = './views/group/announcements.html';
            } else if (view == 'Tasks') {
                $scope.data.view = './views/group/tasks.html';
            }
            else if (view == 'Questions') {
                $scope.data.view = './views/group/questions.html';
            }
            else if (view == 'Posts') {
                $scope.data.view = './views/group/posts.html';
            }
            else if (view == 'Contents') {
                $scope.data.view = './views/group/contents.html';
            }
            else if (view == 'Users') {
                $scope.data.view = './views/group/users.html';
            }


        };
        $scope.joiningGroup = false;
        $scope.joinGroup = function () {
            $scope.joiningGroup = true;

            var $user_id = $Auth.getUser('id');
            var $group_id = $scope.Group.id;
            var $formData = {
                user_id: $user_id,
                group_id: $group_id
            };
            $http.post('http://esnback.com/groupusers/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        if (data.result.added) {
                            $scope.groupJoined = true;
                            _load();
                        } else if (data.result.requested) {
                            $scope.groupRequested = true;
                        }
                        $scope.joiningGroup = false;

                    }
                }).error(function (error) {
                    console.log(error);
                });
            console.log($formData);
        };
        $scope.joiningGroup = false;

        $scope.unJoinGroup = function () {
            $scope.joiningGroup = true;
            var $group_id = $scope.Group.id;
            $http.delete('http://esnback.com/groupusers/delete/' + $group_id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.groupJoined = false;
                        $scope.joiningGroup = false;
                        $scope.groupNotJoined = true;
                        _load();

                    }
                    console.log(data);
                }).error(function (error) {
                    console.log(error);
                });
        };

        $scope.joiningGroup = false;

        $scope.cancelRequest = function () {
            $scope.joiningGroup = true;
            var $group_id = $scope.Group.id;
            if ($scope.groupRequested)
                $http.delete('http://esnback.com/groupusers/deleteRequest/' + $group_id + '.json', {withCredentials: true})
                    .success(function (data) {
                        if (data.result.success) {
                            $scope.groupRequested = false;
                            $scope.joiningGroup = false;

                        }
                        console.log(data);
                    }).error(function (error) {
                        console.log(error);
                    });
        };
        $scope.seeRequests = function () {

            $scope.data.view = './views/group/requests.html';
        };
    })
    .controller('GroupMenuController', function ($scope) {
        var $menus = ['Announcements', 'Tasks', 'Posts', 'Questions', 'Contents', 'Users'];
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
        }
    }).controller('GroupAnnouncementsController', function ($scope, $http) {
        $scope.data = {
            announcements: []
        };
        $scope.loadingAnnouncements = false;
        var updateAnnouncements = function () {
            $scope.loadingAnnouncements = true;
            $http.post('http://esnback.com/announcements/getByGroup/' + $scope.Group.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.loadingAnnouncements = false;
                        $scope.data.announcements = data.result.announcements;
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.groupLoaded.then(function () {
            if ($scope.groupOwner || $scope.groupJoined)
                updateAnnouncements();
        });


        $scope.addAnnouncement = function () {
            var $formData = {
                Announcement: {
                    title: $scope.new_title,
                    announcement: $scope.new_description,
                    group_id: $scope.Group.id
                }
            };
            $http.post('http://esnback.com/announcements/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        var $announcement = data.result.announcement;
                        $scope.data.announcements.unshift($announcement);
                        $scope.new_title = '';
                        $scope.new_description = '';
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.deleteAnnouncement = function ($announcement_id, $index) {
            $http.delete('http://esnback.com/announcements/delete/' + $announcement_id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.announcements.splice($index, 1);
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }


    }).controller('GroupPostsController', function ($scope, $http, fileUpload) {

        $scope.data = {
            posts: {}
        };
        $scope.loadingGroupPosts = false;
        var updatePosts = function () {
            $scope.loadingGroupPosts = true;
            $http.post('http://esnback.com/posts/findByGroup/' + $scope.Group.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.loadingGroupPosts = false;
                        $scope.data.posts = data.result.posts;
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.groupLoaded.then(function () {
            if ($scope.groupOwner || $scope.groupJoined)
                updatePosts();

        });
        var editable_post_id = -1;

        $scope.editPost = {
            content_id: null,
            removeFile: true
        };

        var resetFileStatus = function () {
            $scope.$fileStatus = {
                isUploaded: false,
                content_id: null,
                content_path: null
            };
            $scope.fileStatus = 'No file';
            $scope.isUploading = false;
        };

        resetFileStatus();


        $scope.uploadfile = function () {
            $scope.isUploading = true;
            $scope.fileStatus = 'Please wait while the file gets uploaded';
            var file = $scope.postFile;
            if (editable_post_id != -1) {
                file = $scope.editFile;
            }
            var uploadUrl = 'http://esnback.com/contents/uploadFile.json';
            var uploadData = fileUpload.uploadFileToUrl(file, uploadUrl);
            uploadData.then(function (result) {
                if (result != null && result.success) {
                    $scope.$fileStatus.isUploaded = true;
                    $scope.$fileStatus.content_id = result.content_id;
                    $scope.$fileStatus.content_path = result.content_path;
                    $scope.fileStatus = 'File Successfully Attached';
                    //resetFileStatus();
                } else {
                    $scope.fileStatus = result.message;

                }
                $scope.isUploading = false;
            });
        };
        $scope.addPost = function () {
            var $formData = {
                Post: {
                    post: $scope.new_post,
                    privacy_id: 1,
                    content_id: $scope.$fileStatus.content_id,
                    group_id: $scope.Group.id
                }
            };
            $http.post('http://esnback.com/posts/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        var $post = data.result.post;
                        $scope.data.posts.unshift($post);
                        $scope.new_post = " ";
                        resetFileStatus();
                    }
                    else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };


        $scope.isEditable = function ($post_id) {
            return $post_id == editable_post_id;
        };
        $scope.setEditable = function ($post_id) {
            editable_post_id = $post_id;
            resetFileStatus();
        };

        $scope.savePost = function ($post, $index) {
            if ($scope.editPost.removeFile) {
                $post.content_id = null;
            } else if (!angular.isUndefined($scope.editPost.content_id) && $scope.editPost.content_id != null) {
                $post.content_id = $scope.editPost.content_id;
            }

            $http.post('http://esnback.com/posts/edit/' + $post.id + '.json', {'Post': $post}, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        editable_post_id = -1;
                        $scope.data.posts[$index] = data.result.post;
                        console.log(data);
                        resetFileStatus();
                    } else {
                        console.log(data);
                        resetFileStatus();
                    }
                })
                .error(function (error) {
                    console.log(error);
                    resetFileStatus();
                });

        };

        $scope.deletePost = function (id, $index) {
            $http.delete('http://esnback.com/posts/delete/' + id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.posts.splice($index, 1);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }

    }).
    controller('GroupEditPostController', function ($scope, $http, fileUpload) {
        var resetFileStatus = function () {
            $scope.$fileStatus = {
                isUploaded: false,
                content_id: null,
                content_path: null
            };
            $scope.fileStatus = 'No file';
            $scope.isUploading = false;
        };

        resetFileStatus();


        $scope.uploadfile = function () {
            $scope.isUploading = true;
            $scope.fileStatus = 'Please wait while the file gets uploaded';
            var file = $scope.postFile;
            var uploadUrl = 'http://esnback.com/contents/uploadFile.json';
            var uploadData = fileUpload.uploadFileToUrl(file, uploadUrl);
            uploadData.then(function (result) {
                if (result != null && result.success) {
                    $scope.$fileStatus.isUploaded = true;
                    $scope.$fileStatus.content_id = result.content_id;
                    $scope.$fileStatus.content_path = result.content_path;
                    $scope.fileStatus = 'File Successfully Attached';
                    $scope.editPost.content_id = result.content_id;
                } else {
                    $scope.fileStatus = result.message;

                }
                $scope.isUploading = false;
            });
        };

    }).controller('GroupQuestionsController', function ($scope, $http) {
        $scope.data = {
            questions: []
        };
        $scope.loadingQuestions = false;
        var updateQuestions = function () {
            $scope.loadingQuestions = true;
            $http.post('http://esnback.com/questions/getByGroup/' + $scope.Group.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.loadingQuestions = false;
                        $scope.data.questions = data.result.questions;
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.groupLoaded.then(function () {
            if ($scope.groupOwner || $scope.groupJoined)
                updateQuestions();
        });
        $scope.addQuestion = function () {
            var $formData = {
                Question: {
                    question: $scope.new_question,
                    group_id: $scope.Group.id
                }
            };
            $http.post('http://esnback.com/questions/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        var $question = data.result.question;
                        $scope.data.questions.push($question.Question);
                        console.log($question.Question);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };

        $scope.answers = {};
        $scope.viewAnswers = {};
        $scope.viewAnswers = function (id) {
            $http.get('http://esnback.com/answers/findByQuestion/' + id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success)
                        $scope.answers[id] = data.result.answers;
                    $scope.viewAnswers[id] = true;
                }).error(function (error) {
                    console.log(error);
                });
        };

        $scope.hideAnswers = function (id) {
            $scope.viewAnswers[id] = false;
        };
        $scope.addAnswer = function (question_id, new_answer) {
            var $formData = {
                Answer: {
                    answer: new_answer,
                    question_id: question_id
                }
            };
            console.log($formData);
            $http.post('http://esnback.com/answers/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        var $answer = data.result.answer;
                        $scope.answers[question_id].push($answer);
                        console.log($answer.Answer);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }

    }).controller('GroupUsersController', function ($scope, $http) {
        $scope.users = {};
        $scope.usersLoading = false;
        var loadUsers = function () {
            $scope.usersLoading = true;
            $http.get('http://esnback.com/groups/getUsers/' + $scope.Group.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.users = data.result.users;
                        $scope.usersLoading = false;
                    } else
                        console.log(data);
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.groupLoaded.then(function () {
            if ($scope.groupOwner || $scope.groupJoined)
                loadUsers();

        });
        $scope.removeProcessing = false;
        $scope.removeUser = function ($user_id, $index) {
            $scope.removeProcessing = true;

            $http.delete('http://esnback.com/groups/deleteUser/' + $user_id + '/' + $scope.Group.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.users.splice($index, 1);
                        $scope.removeProcessing = false;
                    } else {
                        console.log(data);
                        $scope.removeProcessing = false;

                    }
                }).error(function (error) {
                    console.log(error);
                });
        }

    })
    .controller('GroupContentsController', function ($scope, $http, $Auth, fileUpload) {
        $scope.contents = {};
        $scope.$fileStatus = {
            isUploaded: false,
            content_id: null,
            content_path: null
        };
        $scope.fileStatus = 'No file';
        $scope.isUploading = false;
        $scope.contentLoading = false;
        var loadContent = function () {
            $scope.contentLoading = true;
            $http.get('http://esnback.com/groupcontents/getByGroup/' + $scope.Group.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        $scope.contents = data.result.group_contents;
                        $scope.contentLoading = false;

                    } else
                        console.log(data);
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.groupLoaded.then(function () {
            if ($scope.groupOwner || $scope.groupJoined)
                loadContent();
        });

        $scope.uploadfile = function () {
            $scope.isUploading = true;
            $scope.fileStatus = 'Please wait while the file gets uploaded';
            var file = $scope.contentFile;
            var uploadUrl = 'http://esnback.com/contents/uploadFile.json';
            var uploadData = fileUpload.uploadFileToUrl(file, uploadUrl);
            uploadData.then(function (result) {
                if (result != null && result.success) {
                    $scope.$fileStatus.isUploaded = true;
                    $scope.$fileStatus.content_id = result.content_id;
                    $scope.$fileStatus.content_path = result.content_path;
                    $scope.fileStatus = 'File Successfully Attached';
                }
                $scope.isUploading = false;
            });
        };
        $scope.addContent = function () {
            var $formData = {
                'Groupcontent': {
                    'title': $scope.new_title,
                    'description': $scope.new_description,
                    'group_id': $scope.Group.id,
                    content_id: $scope.$fileStatus.content_id
                }
            };
            $http.post('http://esnback.com/groupcontents/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.contents.unshift(data.result.content);
                    }
                    console.log(data);
                }
            ).error(function (error) {
                    console.log(error);
                }
            );
        };


        $scope.deleteContent = function (id, $index) {
            $http.delete('http://esnback.com/groupcontents/delete/' + id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.contents.splice($index, 1);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }
    })
    .controller('GroupTasksController', function ($scope, $http, $Auth, fileUpload, $interval) {
        $scope.tasks = {};
        $scope.$fileStatus = {
            isUploaded: false,
            content_id: null,
            content_path: null
        };
        $scope.server_time = {};
        var getTime = true;
        $interval(function () {
            if (getTime) {
                getTime = false;
                $http.get('http://esnback.com/tasks/gettime.json')
                    .success(function (data) {
                        if (data.result.success) {
                            $scope.server_time = data.result.server_time;
                            getTime = true;
                        }
                    })
                    .error();

            }
        }, 100);
        $scope.fileStatus = 'No file';
        $scope.isUploading = false;

        $scope.uploadfile = function () {
            $scope.isUploading = true;
            $scope.fileStatus = 'Please wait while the file gets uploaded';
            var file = $scope.contentFile;
            var uploadUrl = 'http://esnback.com/contents/uploadFile.json';
            var uploadData = fileUpload.uploadFileToUrl(file, uploadUrl);
            uploadData.then(function (result) {
                if (result != null && result.success) {
                    $scope.$fileStatus.isUploaded = true;
                    $scope.$fileStatus.content_id = result.content_id;
                    $scope.$fileStatus.content_path = result.content_path;
                    $scope.fileStatus = 'File Successfully Attached';
                }
                $scope.isUploading = false;
            });
        };

        $scope.loadingTasks = false;
        var loadTasks = function () {
            $scope.loadingTasks = true;
            $http.get('http://esnback.com/tasks/getbygroup/' + $scope.Group.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        $scope.tasks = data.result.tasks;
                        $scope.loadingTasks = false;
                    } else {
                        console.log(data);
                        $scope.loadingTasks = false;
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.groupLoaded.then(function () {
            if ($scope.groupOwner || $scope.groupJoined)
                loadTasks();
        });
        $scope.createTask = function () {
            var $formData = {
                'Task': {
                    'title': $scope.new_title,
                    'description': $scope.new_description,
                    'enddate': $scope.new_datetime,
                    'group_id': $scope.Group.id,
                    'content_id': $scope.$fileStatus.content_id
                }
            };
            $http.post('http://esnback.com/tasks/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.tasks.unshift(data.result.task);
                    }
                    console.log(data);
                }
            ).error(function (error) {
                    console.log(error);
                }
            );
        };


        $scope.viewSolutions = function (task_id) {
            $scope.data.task_id = task_id;
            $scope.data.view = './views/group/solutions.html';

        };
    }).controller('GroupSolutionsController', function ($scope, $http, $Auth, fileUpload) {
        $scope.$fileStatus = {
            isUploaded: false,
            content_id: null,
            content_path: null
        };
        $scope.fileStatus = 'No Solution File Attached';
        $scope.isUploading = false;
        $scope.solutionUploaded = false;
        $scope.resubmit = false;
        $scope.resubmitSolution = function () {
            $scope.resubmit = true;
            $scope.solutionUploaded = false;
        };

        $scope.uploadfile = function () {
            $scope.isUploading = true;
            $scope.fileStatus = 'Please wait while the file gets uploaded';
            var file = $scope.solutionFile;
            var uploadUrl = 'http://esnback.com/contents/uploadFile.json';
            var uploadData = fileUpload.uploadFileToUrl(file, uploadUrl);
            uploadData.then(function (result) {
                if (result != null && result.success) {
                    $scope.$fileStatus.isUploaded = true;
                    $scope.$fileStatus.content_id = result.content_id;
                    $scope.$fileStatus.content_path = result.content_path;
                    $scope.fileStatus = 'File Successfully Attached';
                }
                $scope.isUploading = false;
            });
        };

        $scope.submitSolution = function (task_id) {
            var $formData = {
                'Solution': {
                    'solution': $scope.new_solution,
                    'user_id': $Auth.getUser('id'),
                    'task_id': task_id,
                    'content_id': $scope.$fileStatus.content_id
                }
            };
            if ($scope.resubmit) {
                $formData.Solution.id = $scope.solution_id;
                $http.post('http://esnback.com/solutions/edit/' + $scope.solution_id + '.json', $formData, {withCredentials: true})
                    .success(function (data) {
                        console.log(data);

                        if (data.result.success) {
                            $scope.solutionUploaded = true;
                            $scope.resubmit = false;
                            $scope.solution_id = data.result.solution_id;
                        }
                    }
                ).error(function (error) {
                        console.log(error);
                    }
                );
            } else {
                $http.post('http://esnback.com/solutions/add.json', $formData, {withCredentials: true})
                    .success(function (data) {
                        console.log(data);
                        if (data.result.success) {
                            $scope.solutionUploaded = true;
                            $scope.resubmit = false;
                            $scope.solution_id = data.result.solution_id;
                        }
                    }
                ).error(function (error) {
                        console.log(error);
                    }
                );
            }

        };
        $scope.task_solutions = {};
        $scope.task_title = "";
        var $task_id = $scope.data.task_id;
        if (!angular.isUndefined($task_id)) {
            $http.post('http://esnback.com/solutions/getByTask/' + $task_id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.task_solutions = data.result.solutions;
                        if ($scope.task_solutions.length > 0) {
                            $scope.task_title = $scope.task_solutions[0]['Task']['title'];
                        } else {
                            $scope.task_title = "No solution has been submitted yet";
                        }
                    } else {
                        console.log(data);
                    }
                }
            ).error(function (error) {
                    console.log(error);
                }
            );
        }


    }).controller('GroupRequestsController', function ($scope, $http) {
        $scope.data.requests = [];
        $scope.loadingRequests = false;
        var loadRequests = function () {
            $scope.loadingRequests = true;
            $http.get('http://esnback.com/groups/getrequests/' + $scope.Group.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.requests = data.result.requests;
                        $scope.loadingRequests = false;
                    } else {
                        console.log(data);
                        $scope.loadingRequests = false;
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.groupLoaded.then(function () {
            if ($scope.groupOwner)
                loadRequests();
        });
        $scope.processingRequest = false;
        $scope.acceptRequest = function ($JoinRequest, $index) {
            $scope.processingRequest = true;

            var $formData = {
                JoinRequest: $JoinRequest
            };
            $http.post('http://esnback.com/groups/acceptRequest.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.requests.splice($index, 1);
                        $scope.processingRequest = false;
                    } else {
                        console.log(data);
                        $scope.processingRequest = false;
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };

        $scope.processingRequest = false;
        $scope.rejectRequest = function ($JoinRequest, $index) {
            $scope.processingRequest = true;

            var $formData = {
                JoinRequest: $JoinRequest
            };
            $http.post('http://esnback.com/groups/rejectRequest.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.requests.splice($index, 1);
                        $scope.processingRequest = false;
                    } else {
                        console.log(data);
                        $scope.processingRequest = false;
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
    }).controller('EditGroupController', function ($scope, $http, $location, $routeParams) {
        $scope.form = {};
        $scope.form.privacy = 1;
        $scope.form.interests = [];
        $scope.form.selectedInterest = null;
        var $group = {};
        $http.get('http://esnback.com/groups/getById/' + $routeParams.group_id + '.json', {withCredentials: true})
            .success(function (data) {
                if (!angular.isUndefined(data.result.success) && data.result.success) {
                    $group = data.result.group;
                    $scope.form.privacy = $group.Group.groupprivacy_id;
                    $scope.form.interests = $group.Interest;
                    $scope.form.title = $group.Group.title;
                    $scope.form.description = $group.Group.description;

                } else {
                    console.log();
                }
            }).error(function (error) {
                console.log(error);
            });
        $scope.addInterest = function () {
            if (!angular.isUndefined($scope.form.selectedInterest) && $scope.form.selectedInterest != null) {
                var $interest = $scope.form.selectedInterest.originalObject;
                console.log($interest.Interest);
                $scope.form.interests.push($interest.Interest);
            }
        };
        $scope.deleteInterest = function (id, $index) {
            $http.delete('http://esnback.com/groups/deleteInterest/' + id + '/' + $routeParams.group_id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.form.interests.splice($index, 1);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        var getInterestsIdArray = function () {
            var result = [];
            for (var i = 0; i < $scope.form.interests.length; i++) {
                result.push($scope.form.interests[i].id);
            }
            return result;
        };
        var getFormJson = function () {

            return {
                Group: {
                    id: $group.Group.id,
                    title: $scope.form.title,
                    description: $scope.form.description,
                    groupprivacy_id: $scope.form.privacy

                },
                Interest: getInterestsIdArray()
            };
        };
        $scope.edit_group = function () {
            var $formData = getFormJson();
            $http.post('http://esnback.com/groups/edit/' + $routeParams.group_id + '.json', $formData, {withCredentials: true})
                .success(function (data) {
                    console.log(data);
                    if (data.result.success) {
                        $location.path('/group/' + $routeParams.group_id);
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        };

    })
;