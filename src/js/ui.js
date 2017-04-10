'use strict';

var ui = function() {
    return {
        init: function(options) {
            var $slider = $('div.slider');
            if ($slider.length === 0) {
                return false;
            }

            $slider.noUiSlider({
                start: [options.min || 3, options.max || 4],
                step: 1,
                connect: true,
                
                range: {
                    min: 1,
                    max: 10
                }
            });

            $slider.noUiSlider_pips({
                mode: 'steps',
                density: 20
            });
        },
        length: function(value) {
            var $slider = $('div.slider');
            if ($slider.length === 0) {
                return false;
            }

            if (!value) {
                return {
                    max: $slider.val()[1] >> 0,
                    min: $slider.val()[0] >> 0
                }
            }

            $slider.val([value.min, value.max]);
        },
        progress: function(percents) {
            var $resultBar = $('div.search-result-bar');
            if ($resultBar.length === 0) {
                return false;
            }

            var $progressBar = $resultBar.find('.progress-bar');
            if ($progressBar.length === 0) {
                return false;
            }

            if (percents === 100) {
                $resultBar.removeClass('progress-mode');

                $progressBar.width(0);
            } else {
                $resultBar.addClass('progress-mode');

                $progressBar.width(percents + '%');
            }

            return true;
        },
        notFound: function() {
            var $modal = $('#emptyModal');
            if ($modal.length === 0) {
                return false;
            }

            $modal.modal();

            return true;
        },
        enableModes: function() {
            var $buttons = $('div.search-result-bar label.btn');
            if ($buttons.length === 0) {
                return false;
            }

            $buttons.removeClass('disabled');

            return true;
        },
        searchOn: function() {
            var $button = $('.search-button button');
            if ($button.length === 0) {
                return false;
            }

            $button.removeAttr('disabled');

            return true;
        },
        searchOff: function() {
            var $button = $('.search-button button#startButton');
            if ($button.length === 0) {
                return false;
            }

            $button.attr('disabled', 'disabled');

            return true;
        },
        clean: function($input) {
            var $container = $input.closest('div.has-feedback');
            if ($container.length === 0) {
                return false;
            }

            $container.removeClass('has-success');
            $container.removeClass('has-error');

            var $icon = $container.find('span.glyphicon');
            if ($icon.length === 0) {
                return false;
            }

            $icon.removeClass('glyphicon-ok');
            $icon.removeClass('glyphicon-remove');
            $icon.removeClass('glyphicon-refresh');

            var $username = $container.find('.feedback-user-name');
            if ($username.length === 0) {
                return false;
            }

            $username.text('');

            return true;
        },
        correct: function($input, name) {
            var $container = $input.closest('div.has-feedback');
            if ($container.length === 0) {
                return false;
            }

            $container.addClass('has-success');
            $container.removeClass('has-error');

            var $icon = $container.find('span.glyphicon');
            if ($icon.length === 0) {
                return false;
            }

            $icon.addClass('glyphicon-ok');
            $icon.removeClass('glyphicon-remove');
            $icon.removeClass('glyphicon-refresh');

            var $username = $container.find('.feedback-user-name');
            if ($username.length === 0) {
                return false;
            }

            $username.text(name);

            return true;
        },
        incorrect: function($input) {
            var $container = $input.closest('div.has-feedback');
            if ($container.length === 0) {
                return false;
            }

            $container.addClass('has-error');
            $container.removeClass('has-success');

            var $icon = $container.find('span.glyphicon');
            if ($icon.length === 0) {
                return false;
            }

            $icon.addClass('glyphicon-remove');
            $icon.removeClass('glyphicon-ok');
            $icon.removeClass('glyphicon-refresh');

            var $username = $container.find('.feedback-user-name');
            if ($username.length === 0) {
                return false;
            }

            $username.text('');

            return true;
        },
        lookForUser: function($input) {
            var $container = $input.closest('div.has-feedback');
            if ($container.length === 0) {
                return false;
            }

            $container.removeClass('has-success');
            $container.removeClass('has-error');

            var $icon = $container.find('span.glyphicon');
            if ($icon.length === 0) {
                return false;
            }

            $icon.addClass('glyphicon-refresh');
            $icon.removeClass('glyphicon-ok');
            $icon.removeClass('glyphicon-remove');

            return true;
        },
        panel: {
            changePanel: function(panelName) {
                var $panel = $('div.result-panels div.result-panel#' + panelName);
                if ($panel.length === 0) {
                    return false;
                }

                $('div.result-panels div.result-panel').removeClass('active');
                $panel.addClass('active');

                return true;
            },
            count: function(data) {
                var count = data.sequences[0].length - 2;

                var $panel = $('div.result-panels div.result-panel#count');
                if ($panel.length === 0) {
                    return false;
                }

                $panel.empty();

                var $zeroRow = $('<div>');
                $zeroRow.addClass('empty-row');

                var $firstRow = $('<div>');

                $.each(Array(count), function() {
                    var $icon = $('<span>');
                    $icon.addClass('glyphicon glyphicon-user count-icon');

                    $firstRow.append($icon);
                });

                var $secondRow = $('<div>');

                var usersStr = String(count).slice(-1) === '1' ? 'пользователя' : 'пользователей';
                $secondRow.append('<span>Вы знакомы через ' + count + ' ' + usersStr + '</span>');

                $panel.append($zeroRow, $firstRow, $secondRow);

                return true;
            },
            write: function(data) {
                var $group = $('div.result-panels div.result-panel ul.list-group');
                if ($group.length === 0) {
                    return false;
                }

                $group.find('li.list-group-item').remove();

                data.sequences.forEach(function(row) {
                    row = row.map(function(id) {
                        return data.users.filter(function(item) {
                            return item.uid === id
                        })[0];
                    });

                    var $li = $('<li class="list-group-item">');

                    var $table = $('<div class="item-row">');
                    $li.append($table);

                    row.forEach(function(user) {
                        var title = 'title="<img src={0}><div>Пол: {1}</div><div>ДР: {2}</div></div>"'.format(
                            user.photo_100,
                            user.sex === 2 ? 'мужской' : user.sex === 1 ? 'женский' : 'не говорит',
                            user.bdate || 'не говорит'
                        );

                        var href = 'href="http://vk.com/id{0}"'.format(user.uid);

                        var $cell = $('<div class="item-cell">');

                        $cell.append('<a target="_blank" ' + title + ' ' + href + '>' + [user.first_name, user.last_name].join(' ') + '</a>');
                        $table.append($cell);
                    });

                    $group.append($li);
                });

                $group.find('[title]').tooltip({
                    html: true
                });

                return true;
            },
            draw: function(data) {
                var $panel = $('div.result-panels div.result-panel#draw');
                if ($panel.length === 0) {
                    return false;
                }

                $panel.empty();

                var firstUser, secondUser;
                var sequence = data.sequences[0];
                if (sequence) {
                    firstUser = sequence[0];
                    secondUser = sequence[sequence.length - 1];
                }

                var pairs = [];

                data.sequences.forEach(function(item) {
                    item.reduce(function(a, b) {
                        pairs.push([a, b]);

                        return b;
                    });
                });

                pairs = pairs.filter(function(item, index) {
                    return pairs.filter(function(item1, index1) {
                        return index > index1 && (item[0] === item1[0] && item[1] === item1[1]);
                    }).length === 0;
                });

                var links = pairs.map(function(pair) {
                    return {
                        source: pair[0],
                        target: pair[1]
                    }
                });

                var nodes = {};

                links.forEach(function(link) {
                    var sourceUser = data.users.filter(function(item) {
                        return item.uid === link.source
                    })[0];

                    link.source = nodes[link.source] || (nodes[link.source] = {
                        name: link.source,
                        label: [sourceUser.first_name, sourceUser.last_name].join(' ')
                    });

                    var targetUser = data.users.filter(function(item) {
                        return item.uid === link.target
                    })[0];

                    link.target = nodes[link.target] || (nodes[link.target] = {
                        name: link.target,
                        label: [targetUser.first_name, targetUser.last_name].join(' ')
                    });
                });

                var width = $panel.closest('.container').width(),
                    //height = width * 0.5;
				height = $panel.closest('.container').height();

                var force = d3.layout.force()
                    .nodes(d3.values(nodes))
                    .links(links)
                    .size([width, height])
                    .linkDistance(150)
                    .charge(-100)
                    .on('tick', function() {
                        path.attr('d', function(d) {
                            return 'M' + d.source.x + ',' + d.source.y + ' ' + d.target.x + ',' + d.target.y;
                        });

                        circle.attr('transform', function(d) {
                            return 'translate(' + d.x + ',' + d.y + ')';
                        });

                        text.attr('transform', function(d) {
                            return 'translate(' + d.x + ',' + d.y + ')';
                        });
                    }).start();

                var svg = d3.select('div.result-panels div.result-panel#draw').append('svg')
                    .attr('width', width)
                    .attr('height', height);

                svg.append('defs').selectAll('marker')
                    .data([])
                    .enter().append('marker')
                    .attr('id', function(d) {
                        return d;
                    })
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 15)
                    .attr('refY', -1.5)
                    .attr('markerWidth', 8)
                    .attr('markerHeight', 8)
                    .attr('orient', 'auto')
                    .append('path')
                    .attr('d', 'M0,-5L10,0L0,5');

                var path = svg.append('g').selectAll('path')
                    .data(force.links())
                    .enter().append('path')
                    .attr('class', function(d) {
                        return 'link';
                    });

                var circle = svg.append('g').selectAll('circle')
                    .data(force.nodes())
                    .enter().append('circle')
                    .attr('r', 8)
                    .attr('class', function(d) {
                        if (d.name === firstUser || d.name === secondUser) return 'red';
                    })
                    .call(force.drag);

                var text = svg.append('g').selectAll('text')
                    .data(force.nodes())
                    .enter().append('text')
                    .attr('x', 12)
                    .attr('y', 3)
                    .text(function(d) {
                        return d.label;
                    });

                var $container = $panel.closest('.container');

                setInterval(function() {
                    width = $container.width();
                    height = width * 0.5;

                    force.size([width, height]);

                    svg.attr('height', height);
                }, 2000);

                return true;
            }
        }
    }
}();