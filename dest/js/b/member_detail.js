require.config({
    baseUrl: "../../dest/js",
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
        //流水号
        var trade_listnum=new Array();
        //滚动下拉-------start--------------------------------------------------------
        var timer_rt = null;
        var scroll_if = false;
        var b=1;
        var window_height = window.innerHeight;
        var body_height= $('body').height();
        //活动储值详情----------------------------------------------------------------------------------------------------------------------------------------------------
        $('.js_member_detail').get(0) && (~ function() {
            $(document).ready(function() {
                //获取会员信息todo-show
                //get_member();
                //获取会员消费储值列表todo-show
                //get_rechargeli();
                //测试
                append_ul();
            });
        }());
        $(window).on('scroll', function(e) {
            //var history_top = $(document).scrollTop();
            var history_top=document.documentElement.scrollTop||document.body.scrollTop;
            // console.log('document.documentElement.scrollTop--'+document.documentElement.scrollTop);
            // console.log('document.body.scrollTop--'+document.body.scrollTop);
            if (history_top < body_height - window_height) {
                clearTimeout(timer_rt);
            } else if (scroll_if) {
                e.stopPropagation();
                $('.load').show();
                scroll_if = false;
                timer_rt = window.setTimeout(append_ul, 3000);
            }
        });
        function append_ul() {
            var con_list = '<li><dl><dd>储值赠送<span class="buy_back orange">储值50送5</span></dd><dd class="grey">2016-08-10 15:06:55</dd><div class="clearfix"></div></dl><span class="history_num orange">+<i class="i_normal">5.00</i></span><div class="clearfix"></div></li> <li><dl><dd>储值</dd><dd class="grey">2016-08-10 15:06:55</dd><div class="clearfix"></div></dl><span class="history_num orange">+<i class="i_normal">50.00</i></span><div class="clearfix"></div></li>';
            var con_list1 = '<li><dl><dd>储值消费</dd><dd class="grey">2016-08-10 15:06:55</dd><div class="clearfix"></div></dl><span class="history_num">-<i class="i_normal">25.00</i></span><div class="clearfix"></div></li>';
            
            var list;
            if (b == '1') {
                list = con_list1;
                b = 0;
            } else {
                list = con_list;
                b = 1;
            }
            for(var i=0;i<20;i++){
                $('.js_ul_history').append(list);
            }
            $('.load').hide();
            scroll_if = true;
            body_height = Math.floor($('body').height()).toFixed(0);
            // console.log(body_height); 
        }
        //获取会员信息
        function get_member() {
            var id=yanzheng.get_hash(c);
            $.ajax({
                url: '/prepaid/v1/api/b/member/'+id,
                type: 'GET',
                dataType: 'json',
                data: {},
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
                        var m_img=return_data.avatar;
                        var m_mobile=return_data.mobile;
                        var m_name=return_data.name;
                        var m_times=return_data.recharge_times;
                        var m_amt=(return_data.recharge_amt/100).toFixed(0);
                        var m_balance=(return_data.balance/100).toFixed(2);
                        $('.js_m_img').attr('src',m_img);
                        $('.js_m_tel').text(m_mobile);
                        $('.js_m_name').text(m_name);
                        $('.js_m_times').text(m_times);
                        $('.js_m_all').text(m_amt);
                        $('.js_m_loft').text(m_balance);
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
        //获取会员消费储值列表
        function get_rechargeli() {
            $.ajax({
                url: '/prepaid/v1/api/transactions',
                type: 'GET',
                dataType: 'json',
                data: {
                    'c':yanzheng.get_hash(c),
                    'biz_type':'1,2',
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
                            var dl_data_set_l = trade_listnum.length;

                            var tx_txamt = (return_data[i].txamt / 100).toFixed(2);
                            var tx_pay_amt = (return_data[i].pay_amt / 100).toFixed(2);
                            var tx_present_amt = (return_data[i].present_amt / 100).toFixed(2);
                            var tx_pay_amt0 = (return_data[i].pay_amt / 100).toFixed(0);
                            var tx_present_amt0 = (return_data[i].present_amt / 100).toFixed(0);
                            var tx_time = return_data[i].sysdtm;
                            var tx_status = return_data[i].biz_type;
                            var biz_sn = return_data[i].biz_sn;
                            var li_detail;
                            //判断流水号是否重复
                            var bizn_has = '0';
                            for (var i = dl_data_set_l - 1; i > 0; i--) {
                                if (trade_listnum[i] == biz_sn) {
                                    bizn_has = '1';
                                    break;
                                }
                            }
                            if (bizn_has == '1') {
                                //流水号存在则退出
                                return true;
                            }else{                                
                                trade_listnum.push(biz_sn);
                            }
                            if(tx_status=='1'){
                                //储值
                                li_detail='<li><dl><dd>储值赠送<span class="buy_back orange">储值'+tx_pay_amt0+'送'+tx_present_amt0+'</span></dd><dd class="grey">'+tx_time+'</dd><div class="clearfix"></div></dl><span class="history_num orange">+<i class="i_normal">'+tx_present_amt+'</i></span><div class="clearfix"></div></li> <li><dl><dd>储值</dd><dd class="grey">'+tx_time+'</dd><div class="clearfix"></div></dl><span class="history_num orange">+<i class="i_normal">'+tx_pay_amt+'</i></span><div class="clearfix"></div></li>';
                            }else if(tx_status=='2'){
                                //消费
                                li_detail='<li><dl><dd>储值消费</dd><dd class="grey">'+tx_time+'</dd><div class="clearfix"></div></dl><span class="history_num orange">-<i class="i_normal">'+tx_txamt+'</i></span><div class="clearfix"></div></li>';
                            }else{
                                //退款
                                return true;
                            }
                            $(".js_ul_history").append(li_detail);
                        });
                        var pos_val = $('#js_pos').val() - 0;
                        if (return_data.length < 20) {
                            if(pos_val>0){
                                $('.load').hide();
                                $("#nomoredata").animate({opacity: 0.7,}, 500,'ease-out');
                                window.setTimeout(nomoredata_hide, 2000);
                            } 
                            scroll_if = false;
                        } else {
                            pos_val += 20;
                            $('#js_pos').val(pos_val);
                            scroll_if = true;
                        }
                        $('.zheceng').hide();
                        $('.load').hide();
                        body_height = Math.floor($('body').height()).toFixed(0);
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
        function nomoredata_hide(){
            //$('#nomoredata').hide();
            $("#nomoredata").animate({opacity: 0, }, 500,'ease-out');
        }

    })
})
