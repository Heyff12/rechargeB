define(function() {　
    var url_config = function() {
        require.config({
            baseUrl: "../dest/js",
            paths: {
                "jquery": ["lib/jquery-2.1.4.min", "lib/jquery-1.7.2.min", "http://libs.baidu.com/jquery/2.0.3/jquery"],
                "mobile": "lib/date/jquery.mobile-1.4.5.min",
                "mobiscroll": "lib/date/mobiscroll", //通过shim绑定关联模块jquery
                "yanzheng": "common/yanzheng", //将通用方法放在同一个模块中
                "ajaxps": "common/ajaxps", //在模块中调用其他模块的方法
                "date": "common/date", //在模块中调用其他模块的方法
            },
            shim: {　　　　　　
                'mobiscroll': {　　　　　　　　 deps: ['jquery'], 　　　　　　　　exports: 'mobiscroll'　　　　　　 }
            }
        })
    }

    return {
        url_config: url_config
    };　
});
