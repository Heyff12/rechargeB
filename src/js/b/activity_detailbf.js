require.config({
    baseUrl: "../dest/js",
    paths: {
        "jquery": ["plug/jquery-2.1.4.min", "plug/jquery-1.7.2.min", "http://libs.baidu.com/jquery/2.0.3/jquery"],
        "zepto": "plug/zepto.min",
        "mobile": "plug/date/jquery.mobile-1.4.5.min",
        "mobiscroll": "plug/date/mobiscroll", //通过shim绑定关联模块jquery
        "yanzheng": "common/yanzheng", //将通用方法放在同一个模块中
        "ajaxps": "common/ajaxps", //在模块中调用其他模块的方法
        "date": "common/date", //在模块中调用其他模块的方法
        "close_tip": "common/close_tip", //在模块中调用其他模块的方法
        "date_change": "common/date_change",
    },
    shim: {　　　　　　
        'mobiscroll': {　　　　　　　　
            deps: ['jquery'],
            　　　　　　　　
            exports: 'mobiscroll'　　　　　　
        },
        　　　　　
        'jsonp': {　　　　　　　　
            deps: ['jquery'],
            　　　　　　　　
            exports: 'jsonp'　　　　　　
        },
        'zepto': {　　　　　　　　　　　　　　　　
            exports: '$'　　　　　　
        }
    }
})
require(["zepto", "yanzheng", "close_tip"], function($, yanzheng, close_tip) {
    $(function() {
        //滚动下拉-------start--------------------------------------------------------
        var timer_rt = null;
        var scroll_if = false;
        var b = 1;
        var window_height = window.innerHeight;
        var body_height = $('body').height();
        // console.log(window_height);
        // console.log(body_height); 

        var dl_data = $(".js_datadl").map(function() {
            return $(this).attr('data-bizsn');
        });
        //var dl_data_set = new Set(dl_data.get(0));     
        //活动储值详情----------------------------------------------------------------------------------------------------------------------------------------------------
        $('.js_activity_detail').get(0) && (~ function() {
            $(document).ready(function() {
                //获取当前活动充值统计todo-show
                //get_recharge();
                //获取当前活动充值流水
                //get_rechargeli();
                append_ul();
            });
            //点击查看更多
            // $('.js_click_more').on('click', function() {
            //     get_rechargelist();
            // });
            $(window).on('scroll', function(e) {
                //var history_top = $(document).scrollTop();
                //var history_top = document.documentElement.scrollTop || document.body.scrollTop;
                var history_top=document.documentElement.scrollTop||document.body.scrollTop;
                if (history_top < body_height - window_height) {
                    clearTimeout(timer_rt);
                } else if (scroll_if) {
                    e.stopPropagation();
                    $('.load').show();
                    scroll_if = false;
                    timer_rt = window.setTimeout(append_ul, 3000);
                }
            });
        }());
        //测试去重
        // function get_dl() {
        //     console.log(dl_data_set);
        //     var dl_data_set_l = dl_data_set.size;
        //     var data_arr = ['20160922004499345678', '20160922004499345692', '20160922004499345699', '20160922004499345694', '20160922004499345695', '20160922004499345696', '20160922004499345697', '20160922004499345690', '20160922004499345698', '20160922004499345699', '20160922004499345992'];
        //     var ind = (Math.random() * 10).toFixed(0);
        //     var data_arr_n = [data_arr[ind]];
        //     console.log(ind);
        //     // var dl_data_new = new Set(data_arr_n);
        //     // dl_data_set = new Set([...dl_data_set, ...dl_data_new]);
        //     dl_data_set.add(data_arr[ind]);
        //     var dl_data_set_new_l = dl_data_set.size;
        //     if (dl_data_set_new_l === dl_data_set_l) {
        //         console.log('相同' + dl_data_set + '____' + data_arr_n);
        //         return false;
        //     } else {
        //         console.log('不同' + dl_data_set + '____' + data_arr_n);
        //     }
        //     var li_detail = '<dl class="js_datadl" data-bizsn="' + data_arr[ind] + '"><dt>-48.00</dt><dd>储值消费</dd><dd class="grey">2016-08-10 15:06:55</dd><div class="clearfix"></div></dl>';
        //     $("#js_diff_get").append(li_detail);
        // }

        function append_ul() {
            var con_list = '<li class="js_datadl" data-bizsn=""><dl><dt><img src="../dest/img/ic_shop_round@3x.png"></dt><dd>储值赠送<span class="buy_back orange">储值50送5</span></dd><dd class="grey">2016-08-10 15:06:55</dd><div class="clearfix"></div></dl><span class="history_num">￥<i class="i_normal">5</i></span><div class="clearfix"></div></li>';
            var con_list1 = '<li class="js_datadl" data-bizsn=""><dl><dt><img src="../dest/img/wxchar.png"></dt><dd>储值赠送<span class="buy_back orange">储值50送5</span></dd><dd class="grey">2016-08-10 15:06:55</dd><div class="clearfix"></div></dl><span class="history_num">￥<i class="i_normal">5</i></span><div class="clearfix"></div></li>';
            var list;
            if (b == '1') {
                list = con_list;
                b = 0;
            } else {
                list = con_list1;
                b = 1;
            }
            for(var i=0;i<20;i++){
                $('.js_ul_history').append(list);
            }
            $('.load').hide();
            scroll_if = true;
            //body_height = $('body').height();
            body_height = Math.floor($('body').height()).toFixed(0);
            console.log(body_height); 
        }
        //滚动下拉-------end--------------------------------------------------------

        //获取当前活动充值统计
        function get_recharge() {
            $.ajax({
                url: '/prepaid/v1/api/stat/recharge',
                type: 'GET',
                dataType: 'json',
                data: {
                    //'activity_id':yanzheng.get_hash('activity_id'),
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
                        var money = (return_data.present_amt / 100).toFixed(0);
                        var allmoney = (return_data.pay_amt / 100).toFixed(0);
                        $('.js_money').text(money);
                        $('.js_allmoney').text(allmoney);
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
        //获取当前活动充值流水
        function get_rechargeli() {
            $.ajax({
                url: '/prepaid/v1/api/transactions',
                type: 'GET',
                dataType: 'json',
                data: {
                    'biz_type_l': 1,
                    //'activity_id':yanzheng.get_hash('activity_id'),
                    'pos': $('#js_pos').val(),
                    'count': 20,
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
                        var return_data = data.data;
                        $(return_data).each(function(i, item) {
                            var dl_data = $(".js_datadl").map(function() {
                                return $(this).attr('data-bizsn');
                            }).get();
                            var dl_data_set_l = dl_data.length;
                            var tx_txamt = (return_data[i].txamt / 100).toFixed(2);
                            var tx_pay_amt = (return_data[i].pay_amt / 100).toFixed(2);
                            var tx_present_amt = (return_data[i].present_amt / 100).toFixed(2);
                            var tx_pay_amt0 = (return_data[i].pay_amt / 100).toFixed(0);
                            var tx_present_amt0 = (return_data[i].present_amt / 100).toFixed(0);
                            var tx_img = return_data[i].c_avatar;
                            var tx_time = return_data[i].sysdtm;
                            var tx_status = return_data[i].biz_type;
                            var biz_sn = return_data[i].biz_sn;
                            var tx_name, tx_price;
                            var li_detail;
                            //判断流水号是否重复
                            var bizn_has = '0';
                            for (var i = dl_data_set_l - 1; i > 0; i--) {
                                if (dl_data[i] == biz_sn) {
                                    bizn_has = '1';
                                    break;
                                }
                            }
                            if (bizn_has == '1') {
                                return true;
                            }
                            li_detail = '<li class="js_datadl" data-bizsn="' + biz_sn + '"><dl><dt><img src="' + tx_img + '"></dt><dd>储值赠送<span class="buy_back orange">储值' + tx_pay_amt0 + '送' + tx_present_amt0 + '</span></dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl><span class="history_num">￥<i class="i_normal">' + tx_present_amt0 + '</i></span><div class="clearfix"></div></li><li><dl><dt><img src="' + tx_img + '"></dt><dd>储值</dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl><span class="history_num">￥<i class="i_normal">' + tx_pay_amt0 + '</i></span><div class="clearfix"></div></li>';

                            $(".js_ul_history").append(li_detail);
                        });
                        var pos_val = $('#js_pos').val() - 0;
                        if (return_data.length < 20) {
                            $('#alert_alert').show();
                            $('#alert_alert .alert_con_br').html('数据已加载完毕');
                            $('.zheceng1').show();
                            scroll_if = false;
                            //$('.js_click_more').hide();
                        } else {
                            //$('.js_click_more').show();
                            pos_val += 20;
                            $('#js_pos').val(pos_val);
                            scroll_if = true;
                        }
                        $('.zheceng').hide();
                        $('.load').hide();
                        //body_height = $('body').height();
                        body_height = Math.floor($('body').height()).toFixed(0);
                        console.log(scroll_if);
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
        //关闭弹框
        close_tip.close_tip();

    })
})
