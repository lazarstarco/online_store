window.onload = function () {
    try {
        var data = document.getElementById('data').innerText.split(',')
        var numberOfItems = parseInt(data[0].trim())
        var page = parseInt(data[1].trim())
        var limit = parseInt(data[2].trim())
    } catch { }
    var before = ""
    // `<li class="page-item disabled" id="pagination">
    //     <span class="page-link">Previous</span>
    // </li>`
    var after = ""
    // `<li class="page-item">
    //     <a class="page-link" href="#">Next</a>
    // </li>`

    var html = ""
    var i = 0
    while (i++ < numberOfItems) {
        html +=
            `<li class="page-item`
        html += i === page ? ` active` : ``
        html +=
            `"><a class="page-link" href="/?page=${i}&limit=${limit}">${i}</a></li>`
    }
    $('#pagination').html(before + html + after)

    //localstorage for order
    // localStorage.clear()
    let inputs = document.getElementsByClassName('orderForm');
    for (let i = 0; i < inputs.length; i++) {
        let el = inputs[i];
        let cachedVal = localStorage.getItem(el.attributes['name'].value)
        if (cachedVal != null) {
            el.value = cachedVal;
        }
    }
}
// MAIN
$(function () {
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' })
})
function search() {
    let value = document.getElementById('src').value
    if (value.length == 0) return
    document.getElementById('form').action = '/src=' + value
}
// INDEX
$('[rel="tooltip"]').on('click', function () {
    $(this).tooltip('hide')
})
function showAlertPreorder() {
    document.getElementById('alertPreorder').style.zIndex = '9999'
    $('#alertPreorder').fadeTo(1000, 500).slideUp(500, function () {
        $('#alertPreorder').slideUp(500)
        document.getElementById('alertPreorder').style.zIndex = '-1'
    })
}
function submitPreorderItem(id) {
    var frm = $('#item' + id)

    var data = {
        item_id: $('#item_id' + id).val(),
        quantity: $('#quantity' + id).val()
    }

    frm.submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json'
        })
        showAlertPreorder()
    })
}
function submitLimit(frm) {
    if (frm.value === -1) return
    var url = '/?page=1&limit=' + frm.value
    window.location = url
}
// PREORDERS
function increment(id) {
    document.getElementById('click' + id).stepUp();
}
function decrement(id) {
    document.getElementById('click' + id).stepDown();
}
function showAlertOrder() {
    document.getElementById('alertOrder').style.zIndex = '9999'
    $('#alertOrder').fadeTo(1000, 500).slideUp(500, function () {
        $('#alertOrder').slideUp(500)
        document.getElementById('alertOrder').style.zIndex = '-1'
    })
}
function showAlertSubmitQuantity() {
    document.getElementById('alertSubmitQuantity').style.zIndex = '9999'
    $('#alertSubmitQuantity').fadeTo(1000, 500).slideUp(500, function () {
        $('#alertSubmitQuantity').slideUp(500)
        document.getElementById('alertSubmitQuantity').style.zIndex = '-1'
    })
}
function showAlertDelete() {
    $('#alertDelete').fadeTo(1000, 500).slideUp(500, function () {
        $('#alertDelete').slideUp(500)
    })
}
function submitQuantity(id) {
    var frm = $('#form_item' + id)

    var data = {
        id: $('.preorder_id' + id).val(),
        quantity: $('.preorder_quantity' + id).val()
    }

    frm.submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/preorders/quantity',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json'
        })
        showAlertSubmitQuantity()
    })
}
function submitDelete(id) {
    var frm = $('#form_item' + id)

    var data = {
        id: $('.preorder_id' + id).val()
    }

    frm.submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/preorders/delete',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json'
        })
        showAlertDelete()
        $('#submitDeleteId' + id).tooltip('hide')
        $('.card' + id).hide()
        $('#cards').load(document.URL + ' #cards>*', '')
    })
}
function submitOrder() {
    var frm = $('#form_order')

    var data = {
        name: $('#name').val(),
        surname: $('#surname').val(),
        phonenum: $('#phonenum').val(),
        email: $('#email').val(),
        address: $('#address').val(),
        city: $('#city').val(),
        zip: $('#zip').val(),
        country: $('#country').val(),
        payment: $('input[name="paymentRadio"]:checked').val(),
        delivery: $('input[name="deliveryRadio"]:checked').val()
    }

    frm.submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/preorders',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json'
        })
        showAlertOrder()
        $('#cards').remove();
    })
}
function cacheInput(e) {
    localStorage.setItem(e.attributes['name'].value, e.value)
}
// UPLOAD