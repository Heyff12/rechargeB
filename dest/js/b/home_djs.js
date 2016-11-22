require.config({
    baseUrl: "../dest/js",
    paths: {
        "jquery": ["lib/jquery-2.1.4.min", "lib/jquery-1.7.2.min", "http://libs.baidu.com/jquery/2.0.3/jquery"],
        "mobile": "lib/date/jquery.mobile-1.4.5.min",
        "mobiscroll": "lib/date/mobiscroll", //通过shim绑定关联模块jquery
        "yanzheng": "common/yanzheng", //将通用方法放在同一个模块中
        "ajaxps": "common/ajaxps", //在模块中调用其他模块的方法
        "date": "common/date", //在模块中调用其他模块的方法
        "close_tip": "common/close_tip",
        "date_change": "common/date_change",
    },
    shim: {　　　　　　
        'mobiscroll': {　　　　　　　　 deps: ['jquery'], 　　　　　　　　exports: 'mobiscroll'　　　　　　 }
    }
})
require(["jquery", "yanzheng", "close_tip", "date_change"], function($, yanzheng, close_tip, date_change) {
    $(function() {
        //储值首页----------------------------------------------------------------------------------------------------------------------------------------------------
        //获取活动id
        var homepage_url = location.href;
        var activity_id;
        if (homepage_url.indexOf('?') != '-1') {
            activity_id = homepage_url.split('?')[1].split('=')[1];
        }
        $('.js_activity_index').get(0) && (~ function() {
            $(document).ready(function() {
                //获取所有活动信息
                //get_activities();
                //获取活动信息todo-show
                //get_activity();
                //获取当前活动信息
                //get_activitie_now();
            });
            //点击切换活动详情
            $('.js_toogle').on('click', function() {
                var tog_val = $(this).attr('data-toogle');
                if (tog_val === '1') {
                    $(this).attr('data-toogle', '0');
                    $(this).parents('.section_detail').addClass('arrow_t');
                } else {
                    $(this).attr('data-toogle', '1');
                    $(this).parents('.section_detail').removeClass('arrow_t');
                }
            });
        }());
        //获取所有活动信息
        function get_activities() {
            $.ajax({
                url: '/prepaid/v1/api/b/stat/activities',
                type: 'GET',
                dataType: 'json',
                data: {
                    'c': get_hash('c'),
                    'h': get_hash('h'),
                },
                beforeSend: function() {
                    $('#loading').show();
                    $('.zheceng1').show();
                },
                success: function(data) {
                    if (data.respcd != '0000') {
                        $('#alert_alert').show();
                        $('.zheceng1').show();
                        if (!data['respmsg']) {
                            $('#alert_alert .alert_con_br').html(data['resperr']);
                        } else {
                            $('#alert_alert .alert_con_br').html(data['respmsg']);
                        }
                    } else {
                        var return_data = data.data;
                        var total_txamt = (return_data.total_txamt / 100).toFixed(0);
                        $('.js_all_person').text(return_data.user_num);
                        $('.js_all_money').text(total_txamt);
                        $('.zheceng1').hide();
                    }
                },
                error: function(data) {
                    $('#alert_alert').show();
                    $('.zheceng1').show();
                    //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
                    $('#alert_alert .alert_con_br').html('网络超时!');
                },
                complete: function() {
                    $('#loading').hide();
                }
            });
        }
        //获取活动信息
        function get_activity() {
            $.ajax({
                url: '/prepaid/v1/api/b/cur_activity',
                type: 'GET',
                dataType: 'json',
                data: {
                    'c': get_hash('c'),
                    'h': get_hash('h'),
                },
                beforeSend: function() {
                    $('#loading').show();
                    $('.zheceng').show();
                },
                success: function(data) {
                    if (data.respcd != '0000') {
                        $('#alert_alert').show();
                        $('.zheceng').show();
                        if (!data['respmsg']) {
                            $('#alert_alert .alert_con_br').html(data['resperr']);
                        } else {
                            $('#alert_alert .alert_con_br').html(data['respmsg']);
                        }
                    } else {
                        var data_r = data.data.info;
                        //获取备注
                        var return_data_desc = data_r.desc;
                        $('.js_title_normal').text(return_data_desc);
                        //获取时间
                        var start_time = data_r.start_time;
                        var end_time = data_r.end_time;
                        var s_time = date_change.time_change(start_time);
                        var e_time = date_change.time_change2(start_time, end_time);
                        $('.js_start_time').text(s_time);
                        $('.js_end_time').text(e_time);
                        //验证是否过期
                        var return_expired = data_r.active;
                        if (return_expired == '1') {
                            $('.js_content_sub').hide();
                            $('.js_content_sub_disa').show().css('display', 'inline-block');
                        } else {
                            //过期无效
                            $('.js_content_sub').hide();
                            $('.js_content_sub_disa').show().css('display', 'inline-block');
                            $('.js_ac_dateend').removeClass('title_none').siblings('.js_ac_date').addClass('title_none');
                            $('.zheceng').hide();
                            return false;
                        }
                        //活动未开始判断
                        var now_t=new Date();//todo_需要服务器传值
                        var start_t=start_time.substr(0,10).replace(/-/g, '/')+' 00:00:00';//更改样式，保证ie及相关浏览器兼容时间格式
                        var cha_t=now_t-new Date(start_t);
                        if(cha_t>=0){
                            $('.js_ac_dateing').removeClass('title_none').siblings('.js_ac_date').addClass('title_none');
                            $('.zheceng').hide();
                            return false;
                        }else{
                            //活动未开始
                            $('.js_ac_dateno').removeClass('title_none').siblings('.js_ac_date').addClass('title_none');
                        }
                        //开始后获取倒计时
                        var date = new Date(start_t);//活动开始时间
                        var timer_rt = null;
                        //GetRTime(date,timer_rt);
                        $('.zheceng').hide();
                    }
                },
                error: function(data) {
                    $('#alert_alert').show();
                    $('.zheceng').show();
                    //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
                    $('#alert_alert .alert_con_br').html('网络超时!');
                },
                complete: function() {
                    $('#loading').hide();
                }
            });
        }
        //获取当前活动信息
        function get_activitie_now() {
            $.ajax({
                url: '/prepaid/v1/api/b/stat/activity/' + activity_id,
                type: 'GET',
                dataType: 'json',
                data: {
                    'c': get_hash('c'),
                    'h': get_hash('h'),
                },
                beforeSend: function() {
                    $('#loading').show();
                    $('.zheceng2').show();
                },
                success: function(data) {
                    if (data.respcd != '0000') {
                        $('#alert_alert').show();
                        $('.zheceng2').show();
                        if (!data['respmsg']) {
                            $('#alert_alert .alert_con_br').html(data['resperr']);
                        } else {
                            $('#alert_alert .alert_con_br').html(data['respmsg']);
                        }
                    } else {
                        var return_data = data.data;
                        var total_txamt = (return_data.total_txamt / 100).toFixed(0);
                        $('.js_now_person').text(return_data.user_num);
                        $('.js_now_money').text(total_txamt);
                        //获取活动规则
                        var ac_detail = return_data.detail;
                        $(ac_detail).each(function(i, item) {
                            var now_user_num = ac_detail[i].user_num;
                            var now_title = ac_detail[i].title;
                            var li_detail = '<li><span class="fr"><i class="i_normal">' + now_user_num + '人</i>已购买</span>' + now_title + '</li>';
                            $(".js_ul_detail").append(li_detail);
                        });
                        $('.zheceng2').hide();
                    }
                },
                error: function(data) {
                    $('#alert_alert').show();
                    $('.zheceng2').show();
                    //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
                    $('#alert_alert .alert_con_br').html('网络超时!');
                },
                complete: function() {
                    $('#loading').hide();
                }
            });
        }
        //点击储值项
        function click_chulist(obj) {
            $(obj).addClass('li_choose').siblings('li').removeClass('li_choose');
        };
        //关闭弹框
        close_tip.close_tip();        
        //倒计时  
        // var time = '2016-11-20 09:00:00'.substr(0,10).replace(/-/g, '/')+' 00:00:00'; //更改样式，保证ie及相关浏览器兼容时间格式
        // var date = new Date(time);
        // var timer_rt = null;
        // GetRTime();
        // var now = new Date();//服务器当前时间  
        // console.log(now);    
        // function GetRTime() {
        //     var t = time-now;
        //     var nD = Math.ceil(t / (1000 * 60 * 60 * 24));
        //     $(".js_countdown").text(nD);
        //     console.log(t+'---'+nD);
        //     // var year=now.getFullYear();
        //     // var month=now.getMonth()+1;
        //     // var day=now.getDate();
        //     // var today=year+'/'+month+'/'+day+' 23:59:59';
        //     // var today_end=new Date(today)-now;
        //     // console.log(today+'-----'+today_end);
        //     if (t <= 0) {
        //         clearTimeout(timer_rt);
        //     } else {
        //         timer_rt = window.setTimeout(GetRTime(), 100000);
        //     }
        // }        
    })
})
