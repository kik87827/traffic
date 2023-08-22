window.addEventListener("DOMContentLoaded",()=>{
  commonInit();
  formItemFunc();
  contentSkin();
});
window.addEventListener("load",()=>{
  layoutFunc();
  uiPickerRender();
});

/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf('samsung') > -1) {
    browserAdd("samsung");
  }

  if (navigator.platform.indexOf('Win') > -1 || navigator.platform.indexOf('win') > -1) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }


  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/**
 * 레이아웃
 */
function layoutFunc(){
  
}

/**
 * menu rock
 */
function menuRock(target){
  const targetDom = document.querySelector(target);
  if(!!targetDom){
    targetDom.querySelector(".nav_oneitem").classList.add("active");
  }
}

function siblings(t) {
  var children = t.parentElement.children;
  var tempArr = [];

  for (var i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function(e) {
    return e != t;
  });
}




/* popup */

/**
 * 디자인 팝업
 * @param {*} option 
 */
 function DesignPopup(option) {
  this.option = option;
  this.selector = this.option.selector;

  if (this.selector !== undefined) {
    this.selector = document.querySelector(this.option.selector);
  }
  this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.layer_wrap_parent = null;
  this.btn_closeTrigger = null;
  this.btn_close = null;
  this.bg_design_popup = null;
  this.scrollValue = 0;

  this.btn_close = null;

  const popupGroupCreate = document.createElement("div");
  popupGroupCreate.classList.add("layer_wrap_parent");

  if(!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")){
    this.pagewrap.append(popupGroupCreate);
  }

  this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

  

  // console.log(this.selector.querySelectorAll(".close_trigger"));



  this.bindEvent();
}



DesignPopup.prototype.dimCheck = function(){
  const popupActive = document.querySelectorAll(".popup_wrap.active");
  if(!!popupActive[0]){
    popupActive[0].classList.add("active_first");
  }
  if(popupActive.length>1){
    this.layer_wrap_parent.classList.add("has_active_multi");
  }else{
    this.layer_wrap_parent.classList.remove("has_active_multi");
  }
}
DesignPopup.prototype.popupShow = function () {
  this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");

  if (this.selector == null) {
    return;
  }
  // this.domHtml.classList.add("touchDis");
  
  this.selector.classList.add("active");
  setTimeout(()=>{
    this.selector.classList.add("motion_end");
  },30);
  if ("beforeCallback" in this.option) {
    this.option.beforeCallback();
  }

  if ("callback" in this.option) {
    this.option.callback();
  }
  if(!!this.design_popup_wrap_active){
    this.design_popup_wrap_active.forEach((element,index)=>{
      if(this.design_popup_wrap_active !== this.selector){
        element.classList.remove("active");
      }
    })
  }
  //animateIng = true;

  this.layer_wrap_parent.append(this.selector);
  

  this.dimCheck();

  contentSkin();

  // this.layer_wrap_parent

  // ****** 주소 해시 설정 ****** //
  // location.hash = this.selector.id
  // modalCount++
  // modalHash[modalCount] = '#' + this.selector.id
}
DesignPopup.prototype.popupHide = function () {
  var target = this.option.selector;
  if (target !== undefined) {

    this.selector.classList.remove("motion");
    if ("beforeClose" in this.option) {
      this.option.beforeClose();
    }
     //remove
     this.selector.classList.remove("motion_end");
     setTimeout(()=>{

       this.selector.classList.remove("active");
     },400)
     this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
     this.dimCheck();
     if ("closeCallback" in this.option) {
       this.option.closeCallback();
     }
    //  if (this.design_popup_wrap_active.length == 0) {
    //    this.domHtml.classList.remove("touchDis");
    //  }
  }
}

DesignPopup.prototype.bindEvent = function () {
  this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
  this.bg_design_popup = this.selector.querySelector(".bg_dim");
  this.btn_closeTrigger = this.selector.querySelector(".close_trigger");
  var closeItemArray = [...this.btn_close];

  // this.selector.querySelector(".popup_content_low").addEventListener("scroll",(e)=>{
  //   console.log(this.selector.querySelector(".popup_content_low").scrollTop)
  // });
  console.log();
  if(!!this.btn_closeTrigger){
    closeItemArray.push(this.btn_closeTrigger);
  }
  if (!!this.bg_design_popup) {
    closeItemArray.push(this.bg_design_popup);
  }
  if (closeItemArray.length) {
    closeItemArray.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        this.popupHide(this.selector);
      }, false);
    });
  }
};





/**
 * 디자인 모달
 * @param {*} option 
 */
 function DesignModal(option) {
  this.title = option.title;
  this.message = option.message;
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.design_modal_wrap = null;
  this.btn_dmsmidentify = null;
  this.btn_dmsmcancel = null;
  this.duration = option.duration !== undefined ? option.duration : 400;
  this.initShow(option);
}
  
DesignModal.prototype.initShow = function (option) {
  var innerPublish = '';
  var objThis = this;
  let confirmPublish = option.type === "confirm" ? `<a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>취소</a>` : ``;
  /* 
  innerPublish += "<div class='design_modal_wrap'>";
  innerPublish += "  <div class='bg_design_modal'></div>";
  innerPublish += "  <div class='design_modal_w'>";
  innerPublish += "          <div class='design_modal'>";

  innerPublish += "              <div class='design_modal_cont_w'><div class='design_modal_text'></div></div>";
  innerPublish += "              <div class='btn_dmsm_wrap'>";
  if (option.type === "confirm") {
    innerPublish += "              <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>취소</a>";
  }
  innerPublish += "                  <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>";
  innerPublish += "              </div>";
  innerPublish += "          </div>";
  innerPublish += "  </div>";
  innerPublish += "</div>";
 */
  innerPublish = `
  <div class='design_modal_wrap'>
    <div class='design_modal_tb'>
      <div class='design_modal_td'>
        <div class='bg_design_modal'></div>
        <div class='design_modal'>
          <div class='design_modal_cont_w'>
            <div class='design_modal_maintext'></div>
            <div class='design_modal_subtext'></div>
          </div>
          <div class='btn_dmsm_wrap'>
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmclose'>닫기</a>
          ${confirmPublish}
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>
          </div>
          <a href='javascript:;' class='btn_modal_close'><span class='hdtext'>닫기</span></a>
        </div>
      </div>
    </div>
  </div>
  `;

  
  this.modalparent = document.createElement('div');
  this.pagewrap.appendChild(this.modalparent);
  this.modalparent.classList.add("design_modal_insert_wrap");
  this.modalparent.innerHTML = innerPublish;
  this.closetrigger = document.querySelectorAll(".close_dmtrigger");
  this.design_modal_wrap = document.querySelector(".design_modal_wrap");
  this.btn_modal_close = document.querySelector(".btn_modal_close");

  if (option.type === "confirm" || option.type === "alert") {
    this.design_modal_tit = document.querySelector(".design_modal_tit");
    this.design_modal_text = document.querySelector(".design_modal_maintext");
    this.design_modal_subtext = document.querySelector(".design_modal_subtext");
    this.btn_dmsmidentify = document.querySelector(".btn_dmsmidentify");
    this.design_modal_text.innerHTML = option.main_message;
    this.design_modal_subtext.innerHTML = option.sub_message;
    
  }
  if (option.type === "confirm") {
    this.btn_dmsmcancel = document.querySelector(".btn_dmsmcancel");
  }
  if (option.type === "title") {
    this.design_modal_tit.innerHTML = option.title;
  }
  
  this.bindEvent(option);
}
DesignModal.prototype.show = function () {
  this.pagewrap.style.zIndex = 0;
  this.domHtml.classList.add("touchDis");
  
  
  this.design_modal_wrap.classList.add("active");
  setTimeout(()=>{
    this.design_modal_wrap.classList.add("motion");
  }, 30);
}
DesignModal.prototype.hide = function () {
  var objThis = this;
  this.design_modal_wrap.classList.remove("motion");
  setTimeout(function () {
    objThis.design_modal_wrap.classList.remove("active");
    document.querySelector(".design_modal_insert_wrap").remove();
    objThis.design_modal_wrap.remove();
    objThis.domHtml.classList.remove("touchDis");
  }, 530);
}
DesignModal.prototype.bindEvent = function (option) {
  var objThis = this;
  let btn_close_item = [this.btn_modal_close, ...this.closetrigger];
  btn_close_item.forEach((element,index)=>{
    element.addEventListener("click", function () {
      objThis.hide();
    }, false);
  })
  if (this.btn_dmsmidentify !== null) {
    this.btn_dmsmidentify.addEventListener("click", function () {
      if (option.identify_callback !== undefined) {
        option.identify_callback();
      }
    }, false);
  }
  if (this.btn_dmsmcancel !== null) {
    this.btn_dmsmcancel.addEventListener("click", function () {
      if (option.cancel_callback !== undefined) {
        option.cancel_callback();
      }
    }, false);
  }
}


/* hform_layer */
function hformLayerFunc(target){
  const otherDom = document.querySelectorAll(".hform_layer_wrap");
  const targetDom = document.querySelector(target);
  const layerCloseItem = document.querySelectorAll(".btn_hform_layer_close");
  
  const cformLabel = document.querySelectorAll(".cform_field_tb_item .cform_field_label");

  if(!!otherDom){
    otherDom.forEach((item)=>{
      item.classList.remove("active");
    });
  }
  if(!!targetDom){
    targetDom.classList.add("active");
    setTimeout(()=>{
      if(!!cformLabel){
        maxWidthFunc(".cform_field_tb_item .cform_field_label");
      }
      targetDom.classList.add("motion");
    },30);
  }

  if(!!layerCloseItem){
    layerCloseItem.forEach((item)=>{
      const thisItem = item;
      thisItem.addEventListener("click",(e)=>{
        const thisItemParent = e.currentTarget.closest(".hform_layer_wrap");
        thisItemParent.classList.remove("motion");
        setTimeout(()=>{
          thisItemParent.classList.remove("active");
        },530);
      });
    });
  }
}
/* // hform_layer */




/* input */
function formItemFunc(){
  const input_component_box = document.querySelectorAll(".input_component_box");
  if(!!input_component_box){
    input_component_box.forEach((item)=>{
      if(item.classList.contains('disabled')){
        item.querySelector(".input_origin_item").disabled = true;
      }
    });
  }

  addDynamicEventListener(document.body, 'focusin', '.input_component_box .input_origin_item', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    thisTargetParent.classList.add("focus");
    // if(thisTargetParent.classList.contains("filled")){
    // }
  });
  addDynamicEventListener(document.body, 'keyup', '.input_component_box .input_origin_item', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    if(thisTarget.value.length){
      thisTargetParent.classList.add("filled");
    }else{
      thisTargetParent.classList.remove("filled");
    }
  });
  addDynamicEventListener(document.body, 'focusout', '.input_component_box .input_origin_item', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    thisTargetParent.classList.remove("focus");
    if(thisTarget.value.length ===0){
      thisTargetParent.classList.remove("filled");
    }
  });
  addDynamicEventListener(document.body, 'mousedown','.btn_form_reset', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    const thisTargetInput = thisTargetParent.querySelector(".input_origin_item");
    const thisTargetSearchParent = thisTarget.closest(".search_field_wrap");
    thisTargetInput.value = '';
    thisTargetParent.classList.remove("focus");
    thisTargetParent.classList.remove("filled");
    thisTargetParent.classList.remove("warn");

    if(!!thisTargetSearchParent){
      thisTargetSearchParent.classList.remove("value_true");
      document.querySelector(`[data-autoLayer='${thisTargetSearchParent.getAttribute("id")}']`).classList.remove("auto_mode");
    }
  });

  //textarea
  addDynamicEventListener(document.body, 'focusin', '.form_textarea_box .form_textarea', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".form_textarea_box");
    if(thisTargetParent.classList.contains("filled")){
      thisTargetParent.classList.add("focus");
    }
  });
  addDynamicEventListener(document.body, 'input', '.form_textarea_box .form_textarea', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".form_textarea_box");
    if(thisTarget.value.length){
      thisTargetParent.classList.add("filled");
    }else{
      thisTargetParent.classList.remove("filled");
    }
  });
  addDynamicEventListener(document.body, 'focusout', '.form_textarea_box .form_textarea', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".form_textarea_box");
    thisTargetParent.classList.remove("focus");
    if(thisTarget.value.length ===0){
      thisTargetParent.classList.remove("filled");
    }
   
  });
  
  //select
  addDynamicEventListener(document.body, 'click', '.form_select', function(e) {
    const thisTarget = e.target;
    selectReset();
    thisTarget.classList.add("focus");
  });
  addDynamicEventListener(document.body, 'change', '.form_select', function(e) {
    const thisTarget = e.target;

    setTimeout(()=>{
      thisTarget.classList.remove("focus");
    },10);
  });
  document.querySelector("body").addEventListener("click",(e)=>{
    if(e.target.classList.contains("form_select")){
      return;
    }
    selectReset();
  });

  function selectReset(){
    const selectDom = document.querySelectorAll(".form_select");
    if(!!selectDom){
      selectDom.forEach((item)=>{
        item.classList.remove("focus");
      });
    }
  }
}




/* search  */
function searchForm() {
  const auto_word_layer = document.querySelectorAll(".auto_word_layer");
  const auto_word_item = document.querySelectorAll(".auto_word_item");
  const searchFieldWrap = document.querySelectorAll(".search_field_wrap");
  const searchInput = document.querySelectorAll(".search_field_wrap .input_origin_item");
  let appendLayer = null;
  const appBody = document.querySelector(".page_wrap");
  if (searchInput.length) {
    searchInput.forEach((element, index) => {
      const eachElement = element;
      const eachElementParent = element.closest(".search_field_wrap");
      const eachElementReset = eachElementParent.querySelector(".btn_form_reset");
      const eachElementField = element.closest(".search_field");
      const eachElementLayer = eachElementParent.querySelector(".auto_word_layer");

      eachElement.addEventListener("focus", (e) => {
        searchFieldWrap.forEach((item) => {
          resetLayer(item);
        });
        if (eachElementLayer !== null) {
          autoLayerInit(eachElementParent, eachElementLayer, index);
          autoLayerPos(eachElementParent);
        }
        if (eachElementField !== null) {
          eachElementField.classList.add("active");
        }
      });
      eachElement.addEventListener("input", (e) => {
        let thisEventObj = e.currentTarget;



        eachElementField.classList.add("typing");
        valueCheck(thisEventObj, eachElementParent);
      });
      eachElement.addEventListener("focusout", (e) => {
        let thisEventObj = e.currentTarget;
        eachElementField.classList.remove("typing");
        if (!!eachElementField) {
          eachElementField.classList.remove("active");
        }
        //valueCheck(thisEventObj, eachElementParent);
        //resetLayer(eachElementParent);
      });

      // eachElementReset.addEventListener("click", (e) => {
      //   let thisEventInputObj = eachElementParent.querySelector(".input_origin_item");
      //   thisEventInputObj.value = "";
      //   eachElementParent.classList.remove("value_true");
      //   document.querySelector(`[data-autoLayer='${eachElementParent.getAttribute("id")}']`).classList.remove("auto_mode");
      // });
    });

    if (auto_word_item.length) {
      auto_word_item.forEach((element) => {
        element.addEventListener("click", (e) => {
          let thisEventObj = e.currentTarget;
          let thisEventParentLayer = thisEventObj.closest(".auto_word_layer");
          let thisEventParentCall = document.querySelector(`[id='${thisEventParentLayer.getAttribute("data-autolayer")}']`);
          let thisEventParentCallInput = thisEventParentCall.querySelector(".input_origin_item");

          if (thisEventObj.classList.contains("disabled")) {
            return;
          }
          thisEventParentCallInput.value = thisEventObj.textContent;
          thisEventParentLayer.classList.remove("auto_mode");
        });
      });
    }

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".search_field_wrap") !== null || e.target.closest(".auto_word_layer") !== null) {
        return;
      }
      auto_word_layer.forEach((element) => {
        element.classList.remove("auto_mode");
      });
    });

    window.addEventListener("resize", () => {
      resizePos();
    });


    function autoLayerInit(target, layer, index) {
      let thisElement = target;
      let auto_word_layer = layer;

      if (thisElement.getAttribute("id") === null) {
        thisElement.setAttribute("id", 'search_item_' + index);
        auto_word_layer.setAttribute("data-autoLayer", 'search_item_' + index);
      } else {
        auto_word_layer.setAttribute("data-autoLayer", thisElement.getAttribute("id"));
      }
      // if (thisElement.closest(".popup_content_low") !== null) {
      //   thisElement.closest(".popup_content_low").appendChild(auto_word_layer);
      // } else {
      //   appBody.appendChild(auto_word_layer);
      // }

      if (!!thisElement.closest(".popup_content_low")) {
        thisElement.closest(".popup_content_low").appendChild(auto_word_layer);
      } else if (!!thisElement.closest(".api_middle_main_cols")) {
        thisElement.closest(".api_middle_main_cols").appendChild(auto_word_layer);
      } else if (!!thisElement.closest(".api_middle_sub_cols")) {
        thisElement.closest(".api_middle_sub_cols").appendChild(auto_word_layer);
      } else {
        appBody.appendChild(auto_word_layer);
      }
    }

    function autoLayerPos(target) {
      const thisElement = target;
      appendLayer = document.querySelector(`[data-autoLayer='${thisElement.getAttribute("id")}']`);
      if (appendLayer === null) {
        return;
      }
      if (thisElement.closest(".popup_content_low") !== null) {
        // const popupContentLow = thisElement.closest(".popup_content_low");
        // const popupContentLowTop = popupContentLow.getBoundingClientRect().top;
        // const autolayerInTop = popupContentLow.scrollTop + thisElement.getBoundingClientRect().top;
        // appendLayer.style.top = `${(autolayerInTop - popupContentLowTop) + thisElement.getBoundingClientRect().height}px`;
        // appendLayer.style.left = `${thisElement.getBoundingClientRect().left - thisElement.closest(".popup_content_low").getBoundingClientRect().left}px`;
        // appendLayer.style.width = `${thisElement.scrollWidth}px`;
        posItem(".popup_content_low");
      } else if (!!thisElement.closest(".api_middle_main_cols")) {
        posItem(".api_middle_main_cols");
      } else if (!!thisElement.closest(".api_middle_sub_cols")) {
        posItem(".api_middle_sub_cols");
      } else {
        appendLayer.style.top = `${window.scrollY + thisElement.getBoundingClientRect().top + thisElement.getBoundingClientRect().height}px`;
        appendLayer.style.left = `${thisElement.getBoundingClientRect().left}px`;
        appendLayer.style.width = `${thisElement.scrollWidth + 31}px`;
      }

      function posItem(item) {
        const parentContentLow = thisElement.closest(item);
        const parentContentLowTop = parentContentLow.getBoundingClientRect().top;
        const parentInTop = parentContentLow.scrollTop + thisElement.getBoundingClientRect().top;
        appendLayer.style.top = `${(parentInTop - parentContentLowTop) + thisElement.getBoundingClientRect().height}px`;
        appendLayer.style.left = `${thisElement.getBoundingClientRect().left - parentContentLow.getBoundingClientRect().left}px`;
        appendLayer.style.width = `${thisElement.scrollWidth + 31}px`;
      }
    }


    function resizePos() {
      searchFieldWrap.forEach((element, index) => {
        autoLayerPos(element);
      })
    }



  }

  function valueCheck(target, parent) {
    const thisElement = target;
    const thisElementParent = parent;
    if (appendLayer === null) {
      return;
    }
    appendLayer = document.querySelector(`[data-autoLayer='${thisElementParent.getAttribute("id")}']`);
    let auto_word_list_wrap = appendLayer.querySelector(".auto_word_list_wrap");
    let autoLayerCountOption = thisElementParent.getAttribute("data-rowCount") !== undefined ? thisElementParent.getAttribute("data-rowCount") : 3;
    if (thisElement.value.length) {
      thisElementParent.classList.add("value_true");
      appendLayer.classList.add("auto_mode");
      if (!!appendLayer.querySelectorAll("li")[autoLayerCountOption]) {
        auto_word_list_wrap.style.maxHeight = `${appendLayer.querySelectorAll("li")[autoLayerCountOption].offsetTop}px`;
      }
      appendLayer.classList.add("auto_scroll_show");
    } else {
      resetLayer(thisElementParent);
    }
  }

  function resetLayer(parent) {
    parent.classList.remove("value_true");
    parent.classList.remove("typing");
    if (!!appendLayer) {
      appendLayer.classList.remove("auto_mode");
      appendLayer.classList.remove("auto_scroll_show");
    }
  }
}




/* local layer */

function localLayer(callback){
  const localTarget = document.querySelectorAll("[data-localpopup]");
  let activeLayer = document.querySelector(".local_layer.active");

  if(!!localTarget){
    localTarget.forEach((item)=>{
      item.addEventListener("click",(e)=>{
        e.preventDefault();
        const thisCall = e.currentTarget;

        const thisTarget = document.querySelector(thisCall.getAttribute("data-localpopup")) ?? null;
        const thisTargetParent = document.querySelector(thisCall.getAttribute("data-localParent")) ?? null;
        
        if(!!thisTarget){
          thisTarget.style.top = thisCall.offsetTop+thisCall.getBoundingClientRect().height+8 + 'px';
         thisTarget.classList.toggle("active");
         if(thisTarget.classList.contains("active")){
          window.dispatchEvent(new Event('resize'));
          activeLayer = thisTarget;
          if(callback){
            callback();
          }
         }
        }
      });
    });

    addDynamicEventListener(document.body, 'click', '.page_wrap', function(e) {
      if(e.target.closest(".local_layer") || e.target.getAttribute("data-localpopup") || e.target.closest("[data-localpopup]") || e.target.closest(".ui_picker_render") || e.target.closest(".tui-datepicker") || e.target.classList.contains(".tui-calendar-btn")){
        return;
      }
      if(!!activeLayer){
        activeLayer.classList.remove("active");
      }
    });

    addDynamicEventListener(document.body, 'click', '.tui-calendar-btn , .tui-calendar-title , .tui-calendar-date', function(e) {
      if(!!activeLayer){
        activeLayer.classList.add("active");
      }
    });
  }
}



function maxWidthFunc(target){
  const targetItem = document.querySelectorAll(target);
  let maxArray = [];
  if(!!targetItem){
    targetItem.forEach((item)=>{
      if(item.getAttribute("data-maxelse") == null){
        maxArray.push(item.getBoundingClientRect().width)
      } 
    })
    console.log(maxArray);
    targetItem.forEach((item)=>{
      if(item.getAttribute("data-maxelse") == null){
        item.style.width = Math.max.apply(null,maxArray)+"px";
      }
    })
  }
}



/* ui_picker_render */
function uiPickerRender(){
  const ui_picker_render = document.querySelectorAll(".ui_picker_render");
  const appBody = document.querySelector(".page_wrap");
  if(!ui_picker_render){return}

  init();

  actionPos();
  window.addEventListener("resize",()=>{
    actionPos()
  });

  function init(){
    ui_picker_render.forEach((render)=>{
      if(render.classList.contains("reverse_render")){
        return;
      }
      const thisSiblings = siblings(render);
      if(!render.classList.contains("reverse_render")){
        thisSiblings.forEach((callItem)=>{
          if(callItem.classList.contains("tui-datepicker-input")){
            callItem.setAttribute("data-calendarcall",render.getAttribute("id"));
          }
        });
      }

      if (!!render.closest(".popup_content_low")) {
        render.closest(".popup_content_low").appendChild(render);
      } else if(!!render.closest(".api_middle_main_cols")){
        render.closest(".api_middle_main_cols").appendChild(render);
      } else if(!!render.closest(".api_middle_sub_cols")){
        render.closest(".api_middle_sub_cols").appendChild(render);
      } else {
        appBody.appendChild(render);
      }

      // if (render.closest(".popup_content_low") !== null) {
      //   render.closest(".popup_content_low").appendChild(render);
      // } else {
      //   appBody.appendChild(render);
      // }
    });
  }

  function actionPos(){
    ui_picker_render.forEach((render)=>{
      if(render.classList.contains("reverse_render")){
        return;
      }
      const renderLayerParent = render.closest(".popup_content_low");
      const calendarCall = document.querySelector(`[data-calendarcall='${render.getAttribute("id")}']`);
      let calendarCallLayerParentScrollTop = !!renderLayerParent ? renderLayerParent.scrollTop : 0;

      let call_top = window.scrollY + calendarCall.getBoundingClientRect().top + calendarCall.getBoundingClientRect().height;
      let calendar_layer_top = calendarCallLayerParentScrollTop + calendarCall.getBoundingClientRect().top;
      
      let calendar_left = calendarCall.getBoundingClientRect().left;

      if (!!render.closest(".popup_content_low")) {
        posItem(render,calendarCall,".popup_content_low");
      }else if(!!render.closest(".api_middle_main_cols")){
        posItem(render,calendarCall,".api_middle_main_cols");
      }else if(!!render.closest(".api_middle_sub_cols")){
        posItem(render,calendarCall,".api_middle_sub_cols");
      } else {
        render.style.top = `${call_top}px`;
        render.style.left = `${calendar_left}px`;
        render.style.width = `${calendarCall.getBoundingClientRect().width}px`;
      }
     
    });


    function posItem(render,caller,parent){
      let renderLayerParent = !!render.closest(parent) ? render.closest(parent) : null;
      let parent_contlow_top = renderLayerParent.getBoundingClientRect().top;
      let parent_contlow_left = renderLayerParent.getBoundingClientRect().left;
      let child_caller_top = !!renderLayerParent ? renderLayerParent.scrollTop + caller.getBoundingClientRect().top : 0;
      let child_caller_left = caller.getBoundingClientRect().left;

      render.style.top = `${(child_caller_top - parent_contlow_top) + caller.getBoundingClientRect().height - 1}px`;
      render.style.left = `${child_caller_left - parent_contlow_left}px`;
      render.style.width = `${ caller.getBoundingClientRect().width }px`;
    }
  }
}


function contentSkin(){
  const mid_liquid_row = document.querySelector(".mid_liquid_row");
  skinChange();
  window.addEventListener("resize",()=>{
    skinChange();
  
  });

  function skinChange(){
    if(!mid_liquid_row){return;}
    mid_liquid_row.classList.remove("skin2");
    if(mid_liquid_row.offsetWidth !== mid_liquid_row.scrollWidth){
      mid_liquid_row.classList.add("skin2");
    }
  }
}


function tbodyScroll(target){
  const dataDiv = document.querySelectorAll(target);
  if(!!dataDiv){
    dataDiv.forEach((item)=>{
      const thisZone = item;
      let thisCount = Number(thisZone.dataset.tbody);
      const thisThead = thisZone.querySelector(".divide_thead_wrap");
      const thisTbody = thisZone.querySelector(".divide_tbody_wrap");
      const thisTbodyTargetTr = thisTbody.querySelectorAll("tr")[thisCount];

      if(!!thisTbodyTargetTr){
        thisTbody.style.maxHeight = thisTbodyTargetTr.offsetTop+"px";
        thisThead.style.paddingRight = '12px';
      }
    });
  }
}


/* tooltip */
function tooltipFunc(){
  const tooltipCall = document.querySelectorAll("[data-tooltip]");
  const tooltipWrap = document.querySelectorAll(".tooltip_wrap");
  const api_middle_sub_cols = document.querySelector(".api_middle_sub_cols");
  const appBody = document.querySelector(".page_wrap");
  let tooltopMargin = 10;
  let tooltipActive = null;
  let barwidth = getScrollBarWidth();
  

  if(!tooltipCall || !tooltipWrap){return}

  // tooltipWrap.forEach((item) => {
  //   if (!!item.closest(".popup_content_low")) {
  //     item.closest(".popup_content_low").appendChild(item);
  //   } else if(!!item.closest(".api_middle_main_cols")){
  //     item.closest(".api_middle_main_cols").appendChild(item);
  //   } else if(!!item.closest(".api_middle_sub_cols")){
  //     item.closest(".api_middle_sub_cols").appendChild(item);
  //   } else {
  //     appBody.appendChild(item);
  //   }
  //   console.log(item,item.closest(".api_middle_sub_cols"));
  // });

  tooltipCall.forEach((item)=>{

    const thisItem = item;
    const thisItemToolTip = document.querySelector(item.dataset.tooltip);

    if (!!thisItem.closest(".api_middle_sub_cols")) {
      thisItem.closest(".api_middle_sub_cols").appendChild(thisItemToolTip);
    }

    item.addEventListener("mouseenter",(e)=>{
      e.preventDefault();
      const thisTarget = e.currentTarget;
      const thisTargetLayer = document.querySelector(thisTarget.getAttribute("data-tooltip"));
      if(!!thisTargetLayer){
        thisTargetLayer.classList.remove("posend","active");
        setTimeout(()=>{
          thisTargetLayer.classList.add("active");
        
          tooltipActive = thisTargetLayer;
          posAction(thisTarget);
          setTimeout(()=>{
            thisTargetLayer.classList.add("posend");
          },30);
        },30);
       
      }
      
    });
    item.addEventListener("mouseleave",(e)=>{
      e.preventDefault();
      const thisTarget = e.currentTarget;
      const thisTargetLayer = document.querySelector(thisTarget.getAttribute("data-tooltip"));
      if(!!thisTargetLayer){
        thisTargetLayer.classList.remove("posend","active");
      }
    });
  });

  window.addEventListener("resize",()=>{
    posAction();
  });

  function posAction(target){
    
    let windowInnerWidth = window.innerWidth - barwidth;
    let windowInnerHeight = window.innerHeight - barwidth;

    let topValue = 0;
    let leftValue = 0;

    if(!tooltipActive){return;}

    
    const callItem = target;
    tooltipActive.classList.remove("right_end", "left_end");
    tooltipActive.removeAttribute("style");



    // default
    topValue = callItem.getBoundingClientRect().top + callItem.getBoundingClientRect().height + tooltopMargin; 
    leftValue = callItem.getBoundingClientRect().left - (tooltipActive.getBoundingClientRect().width/2 - callItem.getBoundingClientRect().width/2);


    tooltipActive.setAttribute("style", `
        top : ${topValue}px;
        left : ${leftValue}px;
    `)

    // else
    if(tooltipActive.getBoundingClientRect().right >= windowInnerWidth){
      tooltipActive.classList.add("right_end");
    }
    if(tooltipActive.getBoundingClientRect().left < 0){
      tooltipActive.classList.add("left_end");
    }
    if(tooltipActive.getBoundingClientRect().bottom >= windowInnerHeight){
      topValue = window.scrollY + callItem.getBoundingClientRect().top - tooltipActive.getBoundingClientRect().height - tooltopMargin; 
    }
    tooltipActive.setAttribute("style", `
        top : ${topValue}px;
        left : ${leftValue}px;
    `)
  }
}


/* scroll bar */
function getScrollBarWidth() {
  let el = document.createElement("div");
  el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
  document.body.appendChild(el);
  let width = el.offsetWidth - el.clientWidth;
  el.remove();
  return width;
}