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

    }).controller('GroupController', function ($scope, $http, $routeParams, $Auth, fileUpload) {
        $scope.groupOwner = false;
        $scope.groupJoined = false;

        $scope.owner = {};
        $scope.Group = {};

        $scope.get_group = $http.get('http://esnback.com/groups/getById/' + $routeParams.groupId + '.json', {withCredentials: true})
            .success(function (data) {
                if (data.result.success) {
                    console.log(data.result.group);
                    $scope.Group = data.result.group;
                    $scope.Group.groupData = data.result.group.Group;
                    $scope.owner = data.result.group.User;

                    if ($Auth.getUser('id') == $scope.owner.id) {
                        $scope.groupOwner = true;
                    }

                    else {
                        $scope.groupOwner = false;
                    }
                    for (var i = 0; i < $scope.Group.GroupUser.length; i++) {
                        if ($Auth.getUser('id') == $scope.Group.GroupUser[i].user_id) {
                            $scope.groupJoined = true;
                            break;
                        }
                    }

                    $scope.Group.privacy = data.result.group.Groupprivacy.privacy;
                }
            }).error(function (error) {
                console.log(error);
            });
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
        $scope.joinGroup = function () {
            var $user_id = $Auth.getUser('id');
            var $group_id = $scope.Group.Group.id;
            var $formData = {
                user_id: $user_id,
                group_id: $group_id
            };
            $http.post('http://esnback.com/groupusers/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.groupJoined = true;
                    }
                }).error(function (error) {
                    console.log(error);
                });
            console.log($formData);
        };
        $scope.unJoinGroup = function () {
            var $user_id = $Auth.getUser('id');
            var $group_id = $scope.Group.Group.id;
            var $formData = {
                user_id: $user_id,
                group_id: $group_id
            };
            $http.delete('http://esnback.com/groupusers/delete/' + $group_id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.groupJoined = false;
                    }
                    console.log(data);
                }).error(function (error) {
                    console.log(error);
                });
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
        $scope.data = {};
        $scope.get_group.success(function () {

            $scope.data.announcements = $scope.Group.Announcement;

            console.log($scope.Group);
        });
        $scope.addAnnouncement = function () {
            var $formData = {
                Announcement: {
                    title: $scope.new_title,
                    announcement: $scope.new_description,
                    group_id: $scope.Group.Group.id
                }
            };
            $http.post('http://esnback.com/announcements/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        var $announcement = data.result.announcement;
                        $scope.data.announcements.push($announcement.Announcement);
                        console.log($announcement.Announcement);
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
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }


    }).controller('GroupPostsController', function ($scope, $http, $Auth, $routeParams) {
        console.log($scope.test);
        $scope.data = {
            posts: []
        };
        $scope.profile = {
            user: {}
        };
        var updatePosts = function () {
            $http.post('http://esnback.com/posts/findByGroup/' + $scope.Group.groupData.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.posts = data.result.posts;

                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        updatePosts();
        $scope.addPost = function () {
            var $formData = {
                Post: {
                    post: $scope.new_post,
                    group_id: $scope.Group.Group.id,
                    privacy_id: 1
                }
            };
            $http.post('http://esnback.com/posts/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        var $post = data.result.post;
                        $scope.data.posts.push($post);
                        $scope.new_post = " ";
                        console.log($post);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };

        var editable_post_id = -1;

        $scope.isEditable = function ($post_id) {
            return $post_id == editable_post_id;
        };
        $scope.setEditable = function ($post_id) {
            editable_post_id = $post_id;
        };
        $scope.savePost = function ($post) {
            $http.post('http://esnback.com/posts/edit/' + $post.id + '.json', {'Post': $post}, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        editable_post_id = -1;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });

        };
        $scope.deletePost = function (id, $index) {
            $http.delete('http://esnback.com/posts/delete/' + id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        //$scope.data.posts.splice($index, 1);
                        updatePosts();
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }

    }).controller('GroupQuestionsController', function ($scope, $http) {
        $scope.data = {};
        $scope.get_group.success(function () {

            $scope.data.questions = $scope.Group.Question;

            console.log($scope.Group);
        });
        $scope.addQuestion = function () {
            var $formData = {
                Question: {
                    question: $scope.new_question,
                    group_id: $scope.Group.Group.id
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

        $scope.deleteAnnouncement = function ($announcement_id, $index) {
            $http.delete('http://esnback.com/announcements/delete/' + $announcement_id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.announcements.splice($index, 1);
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
        $http.get('http://esnback.com/groups/getUsers/' + $scope.Group.groupData.id + '.json', {withCredentials: true})
            .success(function (data) {
                if (data.result.success) {
                    $scope.users = data.result.users;
                }
                console.log(data);
            }).error(function (error) {
                console.log(error);
            });
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
                    'group_id': $scope.Group.groupData.id,
                    content_id: $scope.$fileStatus.content_id
                }
            };
            $http.post('http://esnback.com/groupcontents/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.contents.push(data.result.content);
                    }
                    console.log(data);
                }
            ).error(function (error) {
                    console.log(error);
                }
            );
        };


        $http.get('http://esnback.com/groupcontents/getbygroup/' + $scope.Group.groupData.id + '.json', {withCredentials: true})
            .success(function (data) {
                if (data.result.success) {
                    $scope.contents = data.result.group_contents;
                }
                console.log(data);
            }).error(function (error) {
                console.log(error);
            });

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
    .controller('GroupTasksController', function ($scope, $http, $Auth, fileUpload) {
        $scope.tasks = {};
        $scope.$fileStatus = {
            isUploaded: false,
            content_id: null,
            content_path: null
        };
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
        $scope.createTask = function () {
            var $formData = {
                'Task': {
                    'title': $scope.new_title,
                    'description': $scope.new_description,
                    'enddate': $scope.new_datetime,
                    'group_id': $scope.Group.groupData.id,
                    'content_id': $scope.$fileStatus.content_id
                }
            };
            $http.post('http://esnback.com/tasks/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.tasks.push(data.result.task);
                    }
                    console.log(data);
                }
            ).error(function (error) {
                    console.log(error);
                }
            );
        };


        $http.get('http://esnback.com/tasks/getbygroup/' + $scope.Group.groupData.id + '.json', {withCredentials: true})
            .success(function (data) {
                if (data.result.success) {
                    $scope.tasks = data.result.tasks;
                }
                console.log(data);
            }).error(function (error) {
                console.log(error);
            });
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
                        if (data.result.success) {
                            $scope.solutionUploaded = true;
                            $scope.resubmit = false;
                            $scope.solution_id = data.result.solution_id;
                        }
                        console.log(data);
                    }
                ).error(function (error) {
                        console.log(error);
                    }
                );
            } else {
                $http.post('http://esnback.com/solutions/add.json', $formData, {withCredentials: true})
                    .success(function (data) {
                        if (data.result.success) {
                            $scope.solutionUploaded = true;
                            $scope.resubmit = false;
                            $scope.solution_id = data.result.solution_id;
                        }
                        console.log(data);
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


    });