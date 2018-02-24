function addLoader(div) {
    $(div).addClass('m-loader m-loader--info m-loader--lg');
}
function removeLoader(div) {
    $(div).removeClass('m-loader m-loader--info m-loader--lg'); 
}

var rssTabs = function() {
    var tabs = $('[data-name=rsstab]');
    var tabs2 = $('[data-name=rsstab2]');
    var rssmain = $('[data-name=rssmain]');
    var mainNews = $('#box-news-top');
    var loopTH = 10;
    var defaultImages = [
        'news-item01.png',
        'news-item02.png',
        'news-item03.png',
        'news-item04.png',
        'news-item05.png',
        'news-item06.png',
        'news-item07.png',
        'news-item08.png',
        'news-item09.png',
        'news-item10.png',
        'news-item11.png',
        'news-item01.png',
        'news-item02.png',
        'news-item03.png',
        'news-item04.png',
        'news-item05.png',
        'news-item06.png',
        'news-item07.png',
        'news-item08.png',
        'news-item09.png',
        'news-item10.png',
        'news-item11.png',
    ];

    var initRssMain = function() {
        if (rssmain.length === 0) {
            return;
        }

        $(rssmain).each(function(index, el){
            var container = '#' + $(el).attr('data-container');
            var link = $(el).attr('data-rss');
            getContentOfRssMain(container, link);
        });
    }

    var getContentOfRssMain = function(container, link) {
        addLoader(container);
        var templateLarge = '<div class="bnt-large col-xs-12 col-md-12">\
                                <div class="bnt-large-image box-img">\
                                    <a href="{link}">\
                                        <img src="{image}" />\
                                    </a>\
                                </div>\
                                <h3><a href="{link}">{title}</a></h3>\
                                <p class="meta">{meta}</p>\
                                <p>{content}</p>\
                            </div>';
        var templateSmall = '<div class="col-md-3">\
                                <div class="bnti-image box-img">\
                                    <a href="{link}"><img src="{image}" /></a>\
                                </div>\
                                <p class="meta">{meta}</p>\
                                <h3><a href="{link}">{title}</a></h3>\
                            </div>';

        var smallItemTH = 4;

        $.ajax({
            method: 'GET',
            url: config.rooturl + '/rss',
            data: {
                link: link
            },
            success: function(json) {
                if (json.items.length > 0) {
                    var items = json.items;
                    var htmlLarge = $('<div class="row" />');
                    var htmlSmall = $('<div class="row"><div class="bnt-items col-xs-12 col-md-12"><div class="row"></div></div></div>');

                    var chosenImages = [];
                    var smallCounter = 0;
                    for (var i = 0; i < items.length; i++) {
                        var article = items[i];
                        if (!article.hasOwnProperty('content')) {
                            article.content = '';
                        }
                        if (!article.hasOwnProperty('image')) {
                            article.image = '';
                        }
                        if (article.image == '') {
                            var randNumber = Math.floor((Math.random() * defaultImages.length));
                            var loopCounter = 0;
                            while (chosenImages.length > 0 && $.inArray(randNumber, chosenImages) != -1 && loopCounter < loopTH) {
                                randNumber = Math.floor((Math.random() * defaultImages.length));
                                loopCounter++;
                            }
                            chosenImages.push(randNumber);
                            article.image = assetsUrl + 'images/' + defaultImages[randNumber];
                        }

                        var meta = '';
                        if (article.hasOwnProperty('creator') && article.creator != '') {
                            meta = article.creator
                        } else {
                            meta = json.generator;
                        }
                        if (article.pubDate != '') {
                            var d = new Date(article.pubDate);
                            var publishedDate = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
                                d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

                            meta += (meta != '' ? ' - ' : '') + publishedDate;
                        }

                        var itemHTML = templateLarge;
                        if (i > 0) {
                            itemHTML = templateSmall;
                            smallCounter++;
                        }

                        itemHTML = itemHTML.replace(/\{title\}/g, article.title);
                        itemHTML = itemHTML.replace(/\{link\}/g, article.link);
                        itemHTML = itemHTML.replace(/\{image\}/g, article.image);
                        itemHTML = itemHTML.replace(/\{content\}/g, article.content);
                        itemHTML = itemHTML.replace(/\{meta\}/g, meta);

                        itemHTML = $(itemHTML);
                        itemHTML.find('p img').remove();
                        if (i > 0) {
                            htmlSmall.find('.bnt-items .row').append(itemHTML);
                        } else {
                            htmlLarge.append(itemHTML);
                        }


                        if (smallCounter == smallItemTH) {
                            break;
                        }
                    }

                    $(container).append(htmlLarge);
                    $(container).append(htmlSmall);
                }
            },
            complete: function() {
                removeLoader(container);
            }
        });
    }

    var initRssTabs = function() {
        if (tabs.length === 0 && tabs2.length === 0) {
            return;
        }

        tabs.find('li a').each(function(index, el) {
            if ($(el).hasClass('active')) {
                getContent(el);
            }
            $(el).on('click', function() {
                getContent(el);
            });
        });

        tabs2.find('li a').each(function(index, el) {
            if ($(el).hasClass('active')) {
                getContent(el, 2);
            }
            $(el).on('click', function() {
                getContent(el, 2);
            });
        });
    }

    var getContent = function(el, t) {
        t = t || 1;
        var link = $(el).data('link');
        var container = $(el).attr('href');
        if (parseInt($(container).attr('data-loaded')) !== 1) {
            addLoader(container);
            var template = '<div class="newsitem clearfix">\
                                <div class="ni-images ni-images-x2 m--margin-right-16 box-img">\
                                    <a href="{link}" target="_blank"><img src="{image}" width="150" /></a>\
                                </div>\
                                <h3><a href="{link}" target="_blank">{title}</a></h3>\
                                <p class="meta">{meta}</p>\
                                <p>{content}</p>\
                            </div>';
            if (t == 2) {
                template = '<div class="newsitem clearfix">\
                                <div class="ni-images m--margin-right-16 box-img">\
                                    <a href="{link}" target="_blank"><img src="{image}" width="90" /></a>\
                                </div>\
                                <h3><a href="{link}" target="_blank">{title}</a></h3>\
                                <p class="meta">{meta}</p>\
                            </div>';
            }

            $.ajax({
                method: 'GET',
                url: config.rooturl + '/rss',
                data: {
                    link: link
                },
                dataType: 'json',
                success: function(json) {
                    if (json.items.length > 0) {
                        var items = json.items;
                        var html = $('<div class="newslist" />');
                        var chosenImages = [];
                        for (var i = 0; i < items.length; i++) {
                            var article = items[i];
                            if (!article.hasOwnProperty('image')) {
                                article.image = '';
                            }
                            var meta = '';
                            if (article.hasOwnProperty('creator') && article.creator != '') {
                                meta = article.creator
                            } else {
                                meta = json.generator;
                            }
                            if (article.pubDate != '') {
                                var d = new Date(article.pubDate);
                                var publishedDate = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
                                    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

                                meta += (meta != '' ? ' - ' : '') + publishedDate;
                            }
                            var itemHTML = template.replace(/\{title\}/g, article.title);
                            itemHTML = itemHTML.replace(/\{link\}/g, article.link);
                            if (!article.hasOwnProperty('content')) {
                                article.content = '';
                            }
                            itemHTML = itemHTML.replace(/\{content\}/g, article.content);
                            itemHTML = itemHTML.replace(/\{meta\}/g, meta);
                            itemHTML = itemHTML.replace(/\{image\}/g, article.image);

                            itemHTML = $(itemHTML);

                            if (article.image == '') {
                                var randNumber = Math.floor((Math.random() * defaultImages.length));
                                var loopCounter = 0;
                                while (chosenImages.length > 0 && $.inArray(randNumber, chosenImages) != -1 && loopCounter < loopTH) {
                                    randNumber = Math.floor((Math.random() * defaultImages.length));
                                    loopCounter++;
                                }
                                chosenImages.push(randNumber);
                                itemHTML.find('img').attr('src', assetsUrl + 'images/' + defaultImages[randNumber]);
                            }

                            itemHTML.find('p img').remove();
                            itemHTML.find('a').attr('target', '_blank');

                            html.append(itemHTML);
                        }
                        $(container).html(html);
                        $(container).attr('data-loaded', 1);
                    }
                },
                complete: function() {
                    removeLoader(container);
                }
            });
        }
    }

    var initDatepicker = function() {
        $('.inputdatepicker').each(function(index, el){
            $(el).datepicker({
                todayHighlight: true,
                format: "dd/mm/yyyy",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>'
                }
            });
        });
    }

    var initSelect2 = function() {
        $('.m-select-region').each(function(index, el){
            const inputId = $(el).attr('id');
            const value = parseInt($(el).attr('data-value')) || null;

            $(el).select2({
                placeholder: $(el).attr('data-placeholder'),
                allowClear: true,
                ajax: {
                    url: '/region/select',
                    dataType: 'json',
                    delay: 250,
                    data: function(params) {
                        return {
                            parentid: parseInt($(el).attr('data-parentid')),
                            level: parseInt($(el).attr('data-level')),
                            keyword: params.term, // search term
                            page: params.page
                        };
                    },
                    processResults: function(data, params) {
                        // parse the results into the format expected by Select2
                        // since we are using custom formatting functions we do not need to
                        // alter the remote JSON data, except to indicate that infinite
                        // scrolling can be used
                        params.page = params.page || 1;

                        return {
                            results: data.items,
                            pagination: {
                                more: (params.page * 30) < data.total_count
                            }
                        };
                    },
                    cache: true
                },
                escapeMarkup: function(markup) {
                    return markup;
                }, // let our custom formatter work
                templateResult: function(item) {
                    return item.name;
                }, // omitted for brevity, see the source of this page
                templateSelection: function(item) {
                    return item.name || item.text;
                } // omitted for brevity, see the source of this page
            });

            $(el).on('change', function(e){
                $('[data-select-depend="' + inputId + '"]').attr('data-parentid', $(el).val());
            });

            if (value != null) {
                console.log(value);
                $(el).val(value).trigger('change');
            }
        });
    }

    return {
        init: function() {
            initRssTabs();
            initRssMain();
            initDatepicker();
            initSelect2();
        }
    }
}();

$(document).ready(function(){
    rssTabs.init();
});