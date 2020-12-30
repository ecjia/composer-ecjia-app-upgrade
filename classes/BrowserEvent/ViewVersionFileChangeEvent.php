<?php


namespace Ecjia\App\Upgrade\BrowserEvent;


use Ecjia\Component\BrowserEvent\BrowserEventInterface;

class ViewVersionFileChangeEvent implements BrowserEventInterface
{

    public function __construct()
    {

    }

    public function __invoke()
    {
        return <<<JS
(function () {
    //版本文件变动
    $('.old_version_item').click(function() {
        //展开
        let $this = $(this);
        if ($this.attr('class') === 'fontello-icon-angle-double-down') {
            $this.attr('class', 'fontello-icon-angle-double-up');
            if (typeof($this.parent().next('ul').html()) === 'undefined') {
                let params = "v=" + $this.attr('data-ver');
                let url = $(".old_version").attr('data-url');
                $.ajax({
                    type: 'post',
                    url: url,
                    data: params,
                    async: false,
                    success: function(result) {
                        if (result.state === 'error') {
                            smoke.alert(result.message, {
                                ok: js_lang.ok
                            });
                        } else if (result.state === 'success') {
                            let files='<ul class=""><li>'+ js_lang.update_content +'</li><li><pre>'+ result.readme +'</pre></li></ul>';
                            $this.parent().css({'margin-bottom': 0, 'border-radius': '4px 4px 0 0'}).after(files);
                        }
                    },
                    error:function(rs) {
                        console.log(rs.responseText);
                    }
                });
            } else {
                $this.parent().css({'margin-bottom': 0, 'border-radius': '4px 4px 0 0'}).next().show();
            }
        } else {
            //关闭
            $this.attr('class','fontello-icon-angle-double-down');
            $this.parent().css({'margin-bottom': '10px', 'border-radius': '4px'}).next('ul').hide();
        }
    });
})();
JS;
    }

}