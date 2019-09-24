// DISABLED BUTTON WITHOUT CHECKBOX
var $checkboxAgree = $('.checkbox-agree');
var $checkboxAgreeInput = $('.checkbox-agree input');

$checkboxAgree.on('change', function(){
    var $buttonCheckboxContainer = $(this).parent();
    var $checkboxAgreeInput = $(this).children('input[type="checkbox"]');
    var $thisButton = $buttonCheckboxContainer.find('input[type="submit"]');
    if($checkboxAgreeInput.is(':checked')) {
        $thisButton.removeClass('button-disabled');
        $thisButton.removeAttr('disabled')
    }
    else {
        $thisButton.attr('disabled', true);
        $thisButton.addClass('button-disabled')
    };
});

    // VALIDATION
    $('form').each(function(){
    // Объявляем переменные (форма и кнопка отправки)
        $(this).submit(function(e) {
            e.preventDefault();
            var form = $(this);
            var url = form.attr('action');
            var method = form.attr('method');
            var error = 0;

            $(form).find("input").each(function() {

                        var str = $(this).val();
                        var value = $.trim(str);

                        if($(this).hasClass('optional')) {
                            return true;
                        } else {
                            if(!value){
                                $(this).parent().addClass('error');
                                error = 1;
                            }
                            else {
                                var str_length = value.length;
                                if($(this).attr('name') == 'name'){
                                    if(str_length < 2 || str_length > 36){
                                        error = 1;
                                        $(this).addClass('error');
                                    }
                                    // else {
                                    //     $(this).removeClass('error');
                                    // }
                                    else {
                                        var regex = new RegExp(/^[а-яА-ЯёЁa]*$/);
                                        if(regex.test(value) == false) {
                                            error = 1;
                                            $(this).addClass('error');
                                        }
                                        else{
                                            $(this).removeClass('error');
                                        }
                                    }
                                }
                                if($(this).attr('name') == 'number'){

                                    var regex = new RegExp(/^\d+$/);
                                    if(regex.test(value) == false) {
                                        error = 1;
                                        $(this).addClass('error');
                                    }
                                    else{
                                        $(this).removeClass('error');
                                    }
                                }
                                if($(this).attr('name') == 'email'){
                                    if(str_length < 3 || str_length > 64){
                                        error = 1;
                                        $(this).addClass('error');
                                    }
                                    else {
                                        var regex = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
                                        if(regex.test(value) == false) {
                                            error = 1;
                                            $(this).addClass('error');
                                        }
                                        else{
                                            $(this).removeClass('error');
                                        }
                                    }
                                }
                                if($(this).attr('name') == 'phone'){
                                    if(str_length < 10 || str_length > 20){
                                        error = 1;
                                        $(this).addClass('error');
                                    }
                                    else {
                                        $(this).removeClass('error');
                                    }
                                }

                            }
                        }
               })
            if(error) return 1;
        });

});
