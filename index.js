'use strict';
// глобальные функции
let createEl = (el) =>{
    return document.createElement(el);
}

let selector = (sel) => {
     return document.getElementById(sel);
};

// data
const dataMenu = {
     menu: [
         {id:1, name:'Ремонт оборудования', children:''},
         {id:2, name:'Перемещение', children:''},
         {id:3, name:'Обращение в ТД', children:''},
         {id:4, name:'Заявка в ДИТ', children:''},
         {id:5, name:'Заявка 5С', children:''},
         {id:6, name:'Дополнительные сервисы',  children: [
             {id:7, label:'Цифровая оснастка', adress:''},
             {id:8, label:'Корпаротивный портал', adress:''}
         ]}
     ]
 }

// для блоков контента
// Тестовые данные  для логистики
const nameFormDepl = 'deplacement';
const dataDepl = [
    {type:'select', name:'manufacturing', label:'Производство', required: true,
    select: [
        {name:'Выберите подразделие', value:'notSelected'},
        {name:'Производство №1', value:'man1'},
        {name:'Производство №2', value:'man2'},
        {name:'Производство №3', value:'man4'},
        {name:'Техническая дирекция', value:'401'},
        {name:'СГИ', value:'sgi'},
        {name:'УГЭ', value:'ugi'},
        {name:'ОСХ', value:'ОСХ'}
    ]},
    {type:'input', name:'place', label:'Текущее расположение', placeholder: '', required: true, number: false},
    {type:'input', name:'whereToMove', label:'Куда переместить', placeholder: '', required: true, number: false},
    {type:'input', name:'typeWork', label:'Вид работы в полном объеме', placeholder: 'Введите более 2 символов и выберите', required: true, number: false},
    {type:'input', name:'profile', label:'Габариты, мм', placeholder: 'ВхДхШ', required: true, number: false},
    {type:'input', name:'mass', label:'Масса, кг', placeholder: 'Введите число', required: true, number: true},
    {type:'input', name:'description', label:'Примечание', placeholder: '', required: false, number: false},
    {type:'input', name:'owner', label:'Владелец', placeholder: 'Введите МОЛ', required: true, number: false},
    {type:'input', name:'ownerContact', label:'Телефон владельца', placeholder: 'Введите номер', required: true, number: true}    
];

//Тестовые данные для ремонтников
const nameFormRep = 'repair';
const dataRep = [
    {type:'input', name:'mashin', label:'Введите обозначение оборудования', placeholder: 'Введите более 2 символов и выберите', required: true, number: false, data: true},
    {type:'input', name:'place', label:'Местоположение', placeholder: '', required: true, number: false, data: false},
    {type:'input', name:'typeWork', label:'Введите описание неисправности', placeholder: '', required: true, number: false, data: false},
    {type:'input', name:'owner', label:'Контактное лицо', placeholder: '', required: true, number: false, data: false},
    {type:'input', name:'ownerContact', label:'Контактное лицо', placeholder: '', required: true, number: true, data: false},
    {type:'input', name:'ownerContactMail', label:'Почта контактного лица', placeholder: '', required: true, number: false, data: false},
];


//сункция дл поля селективного ввода.
const createSelect = (name, label, required, selectArr) =>{
    let div = createEl('div');
    div.innerHTML = label;
    
    if(required != false){
        let span = createEl('span');
        span.innerHTML = '*';
        span.style = 'color:red';
        div.appendChild(span);
    }
    let br = createEl('br');
        div.appendChild(br);
    let doc = createEl('select');
        doc.name = name;
        selectArr.map((item)=>{
            let option = createEl('option');
            option.value = item.value;
            option.innerHTML = item.name;
        doc.appendChild(option);
        });
    div.appendChild(doc);
    return div;
}


//создаём поле ввода

const createInput = (name, label, placeholder, 
                    required, number, data) => {
    let div = createEl('div');
        div.innerHTML = label;
    if(required != false){
        let span = createEl('span');
        span.innerHTML = '*';
        span.style = 'color:red';
        div.appendChild(span);
    }
    let br = createEl('br');
    div.appendChild(br);
    if (number === true){
        let doc = createEl('input');
        doc.type = 'number';
        doc.name = name;
        doc.size = 11;
        doc.placeholder = placeholder;
        if (data){
            doc.addEventListener('keyup', async (e)=>{
                let el = selector(name);
                console.log(el.value);
                let query = fetch('/api/v1/check/' + name)
                               .then(response => response.json())
                               .then(result => console.log(result));
                console.log(result);
            });
        } 
        div.appendChild(doc);

    } else {
        let doc = createEl('input');
            doc.type = 'text';
            doc.id = name;
            if (data){
                doc.addEventListener('keyup', async (e)=>{
                    let el = selector(name);
                    if(el.value.length>3){
                        console.log(el.value);
                        let checkList = document.getElementsByClassName('live-search-list');
                        if( checkList.length > 0){
                            let itemClear = document.getElementById('searchList');
                            div.removeChild(itemClear);
                        }

                        let data = JSON.stringify({
                            "value": el.value
                        });
                        let response = await fetch('/api/v1/check/' + name, {
                                method: 'POST',
                                headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                                },
                            body: data
                        });
                        let result = await response.json();
                        console.log(result);
                        let liveSearch = createEl('ul');
                        liveSearch.id = 'searchList';
                        liveSearch.className = 'live-search-list';
                        result.resp.map(async (item)=>{
                            let li = createEl('li');
                                li.innerHTML = item.name;
                                li.name = 'searchItem';
                              await li.addEventListener('click', (e) => { 
                                  console.log(li.innerHTML);
                                  el.value = li.innerHTML;
                                });
                                liveSearch.appendChild(li);
                        });
                        
                        div.appendChild(liveSearch);
                    }
                });
            
            } 
            
           doc.addEventListener('focusout',(e)=> {
               setTimeout(()=>{
                let itemClear = document.getElementById('searchList');
                div.removeChild(itemClear);
               }, 300);
           });
            doc.onchange = ()=>{
                //Проверим сделанные измеения
              
            }
        doc.size = 78;
        doc.placeholder = placeholder;
        div.appendChild(doc);
        }
        return div;
    }
    

// Метод получения формы

let getForm = (name, arr) =>{
    let form = createEl('form');
        form.name = name;
        arr.map ((item)=>{
            if(item.type ==='select'){
                let initInForm = createSelect(item.name, item.label, item.required, item.select);
                form.appendChild(initInForm);
            } else if (item.type === 'input'){
                let initInForm =  createInput(item.name, item.label, item.placeholder, item.required, item.number, item.data);
                form.appendChild(initInForm);
            }
        });
    let submit = createEl('button');
        submit.type = 'button';
        submit.innerHTML = 'Подать заявку';
        submit.className = 'btn btn-primary btn-lg btn-block';
        form.appendChild(submit);
    return form;
}

// шапка

let headLabel = 'Цифровой стол подачи заявок';
const createH1 = createEl('h1');
    createH1.innerHTML = headLabel;

const createNav = createEl('nav');
const createMenu = (arr) =>{
    const createUl = createEl('ul');
        createUl.className = 'nav__menu';
        createUl.style = 'background-color: #e3f2fd;';
    const getMenu = arr.map((item)=>{
        let li = createEl('li');
            li.className = 'nav__menu-item';
            li.dataset.idRows = item.id;
            li.innerHTML = item.name;
            if (item.children != ''){
                let ul = createEl('ul');
                ul.className = 'nav_submenu';
                ul.style.display = 'block';
                
                item.children.map((itemChild)=>{
                let liChild = createEl('li');
                    liChild.innerHTML = itemChild.label;
                    liChild.dataset.idRows = itemChild.id;
                    liChild.className = 'nav__submenu-item';
                    liChild.style.display = 'none';
                    ul.appendChild(liChild);
                li.appendChild(ul);
                });
            }
    createUl.appendChild(li);
    });
   createNav.appendChild(createUl);
return createNav;
}

window.onload = function(e){
    const init = (el) =>{
    return document.body.appendChild(el);
    }

    init.createH1;
   const initNav = init(createMenu(dataMenu.menu));
   
  // init(initNav);

    const initMain = createEl('main');
    initMain.innerHTML = '';
    const defaultPage = 'Выберите пункт из сервисного меню';
    const div = createEl('div');
    let h3 = createEl('h3');
        h3.innerHTML = defaultPage;
        div.appendChild(h3);
    initMain.appendChild(div);
    
    const pageClosed = () =>{
        initMain.innerHTML = '';
        const defaultPage = 'Внимание! Сервис временно недоступен.'
        const div = createEl('div');
        let h3 = createEl('h3');
            h3.innerHTML = defaultPage;
            div.appendChild(h3);
        initMain.appendChild(div);  
    }
    const checkCat = (id) => {
        switch(id){
            case 1:
                initMain.innerHTML = '';
                initMain.appendChild(getForm(nameFormRep, dataRep));
                return initMain;
                break;
            case 2:
                initMain.innerHTML = '';
                initMain.appendChild(getForm(nameFormDepl, dataDepl));
                return initMain;
                break;
            case 3:
                return pageClosed();
                break;
            case 4:
                return pageClosed();
                break;
            case 5:
                return pageClosed();
                break;
            case 6:
                return pageClosed();
                break;
            case 7:
                return pageClosed();
                break;
            case 8:
                return pageClosed();
                break;
            default:
                return pageClosed();
                break;
        }
    };
    initNav.addEventListener('click', (e)=>{
        let n = +e.target.dataset.idRows;
        let test = checkCat(n);
        init(test);
    });
}