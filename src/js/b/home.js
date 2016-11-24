require(['../require-config'], function() {
    require(["zepto", "yanzheng", "close_tip", "date_change"], function($, yanzheng, close_tip, date_change) {
        $(function() {
            //储值首页----------------------------------------------------------------------------------------------------------------------------------------------------
            //获取活动id--取消使用，数据合并
            // var homepage_url = location.href;
            // var activity_id;
            // if (homepage_url.indexOf('?') != '-1') {
            //     activity_id = homepage_url.split('?')[1].split('=')[1];
            // }
            $('.js_activity_index').get(0) && (~ function() {
                $(document).ready(function() {
                    //获取所有活动信息
                    //get_activities();
                    //获取活动信息todo-show
                    //get_activity();
                    //获取当前活动信息--取消，加载在上一个请求中
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
                //跳到会员界面
                $('.js_goto_member').on('click', function() {
                    var url_val = location.protocol + '//' + location.host + '/prepaid/v1/page/b/members/index.html';
                    location.href = url_val;
                });
                //跳到总储值流水
                $('.js_goto_allhistory').on('click', function() {
                    var url_val = location.protocol + '//' + location.host + '/prepaid/v1/page/b/transactions/recharge.html';
                    location.href = url_val;
                });
                //跳到当前活动流水
                $('.js_goto_nowhistory').on('click', function() {
                    var id = $(this).attr('data-id');
                    var url_val = location.protocol + '//' + location.host + '/prepaid/v1/page/b/activity_detail.html/?activity_id=' + id;
                    location.href = url_val;
                });
                //fixed更改成absolute，进行top随滚动的调整--start--暂不需要
                var auchorTop = $(".section_footer").css("top");
                auchorTop = Number(auchorTop.substring(0, auchorTop.indexOf("p"))); //首先在监听器外部记录某id=anchor的标签的初始位置 
                var top = document.documentElement.scrollTop || document.body.scrollTop;
                var body_height = $('body').height();
                // console.log(auchorTop);
                // console.log(top);
                // console.log(body_height);
                $(".section_footer").css("bottom", "0px");
                window.onscroll = function(e) {
                    top = document.documentElement.scrollTop || document.body.scrollTop;
                    $(".section_footer").css("top", auchorTop + top + "px");
                };
                //fixed更改成absolute，进行top随滚动的调整--end
            }());
            //获取所有活动信息
            function get_activities() {
                $.ajax({
                    url: '/prepaid/v1/api/b/stat/activities',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        // 'c': yanzheng.get_hash('c'),
                        // 'h': yanzheng.get_hash('h'),
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
                            var total_txamt = (return_data.total_pay_amt / 100).toFixed(0);
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
            //获取活动信息--增加倒计时判断--new
            function get_activity() {
                $.ajax({
                    url: '/prepaid/v1/api/b/cur_activity',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        // 'c': yanzheng.get_hash('c'),
                        // 'h': yanzheng.get_hash('h'),
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
                            //获取活动id--执行获取当前活动数据
                            var return_data_activity_id = data_r.activity_id;
                            $('.js_goto_nowhistory').attr('data-id', return_data_activity_id);
                            get_activitie_now(return_data_activity_id);
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
                            //活动是否开始判断
                            var count_day = data.data.countdown_day;
                            if (count_day <= 0) {
                                $('.js_ac_dateing').removeClass('title_none').siblings('.js_ac_date').addClass('title_none');
                            } else {
                                //活动未开始
                                $('.js_countdown').text(count_day);
                                $('.js_ac_dateno').removeClass('title_none').siblings('.js_ac_date').addClass('title_none');
                            }
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
            function get_activitie_now(activity_id) {
                $.ajax({
                    url: '/prepaid/v1/api/b/stat/activity/' + activity_id,
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        // 'c': yanzheng.get_hash('c'),
                        // 'h': yanzheng.get_hash('h'),
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
                            var total_txamt = (return_data.total_pay_amt / 100).toFixed(0);
                            $('.js_now_person').text(return_data.user_num);
                            $('.js_now_money').text(total_txamt);
                            //获取活动规则
                            var ac_detail = return_data.details;
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
            //关闭弹框
            close_tip.close_tip();
            //倒计时 --start 
            var start_time = '2016-11-23 09:00:00'.substr(0, 10).replace(/-/g, '/') + ' 00:00:00'; //更改样式，保证ie及相关浏览器兼容时间格式
            var start_date = new Date(start_time);
            var sys_time = '2016-11-21 12:00:00'.replace(/-/g, '/');
            var now_time = new Date(sys_time); //服务器当前时间  
            var timer_rt = null;

            GetRTime();

            function GetRTime() {
                //计算距离开始天数
                var t = start_date - now_time;
                var nD = Math.ceil(t / (1000 * 60 * 60 * 24));
                //document.getElementsByClassName('js_countdown').innerHTML=nD;
                $(".js_countdown").text(nD);
                console.log(t + '---' + nD);
                //计算距离今天结束剩余时间                
                var year = now_time.getFullYear();
                var month = now_time.getMonth() + 1;
                var day = now_time.getDate();
                var today = year + '/' + month + '/' + day + ' 23:59:59';
                var tomorrow = year + '/' + month + '/' + (day + 1) + ' 00:00:00';
                var today_end = new Date(today) - now_time;
                console.log(today + '-----' + today_end);
                console.log(new Date(tomorrow));

                if (t <= 0) {
                    clearTimeout(timer_rt);
                } else {
                    now_time=new Date(tomorrow);
                    timer_rt = window.setTimeout(GetRTime, today_end);
                }
            }

        })
    })
})
