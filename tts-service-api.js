export default class TTS_Service_API {

  constructor(options){
    options = options || {};

    this.ajax = null;
    this.url = options.url || 'http://tts.creativum.tk/index.php';
    this.method = options.method || 'POST';
    this.prop = options.prop || 'src';
    this.speaker = options.speaker || null;
    this.lastElement = null;
    this.currentElement = null;
    this.cache = options.cache || true;
    this.cacheAttribute = options.cacheAttribute || 'data-tts-cache';
    
    this.selector = TTS_Service_API.ConvertToArray(options.selector || 'p');
    this.events = TTS_Service_API.ConvertToArray(options.events || 'click');

    this.highlightFunction = options.highlight || function(target){
      target.css({
        background: 'yellow'
      });
    };

    this.clearFunction = options.clear || function(target){
      target.css('background', '');
    }

    this.initEvents();
  }

  get highlightFunctionExists(){
    return typeof this.highlightFunction === 'function';
  }

  get clearFunctionExists(){
    return typeof this.clearFunction === 'function';
  }

  get currentElementExists(){
    return this.currentElement != null;
  }

  get lastElementExists(){
    return this.lastElement != null;
  }

  get getAjaxOptions(){
    return {
      url: this.url,
      type: this.method,
      data: {
        text: text
      }
    };
  }

  initEvents(){
    const tts = this;

    $(document).on(this.events.join(' '), this.selector.join(', '), function(event){
      event.preventDefault();
      tts.applyOnEvent();
    });
  }

  abort(){
    if(this.ajax != null){
      this.ajax.abort();
      this.ajax = null;
    }
  }

  sendOrPlay(target){
    let $target = $(target);
    let src = $target.data(this.cacheAttribute);

    if(!this.cache || !src)
      return this.send($target.text());

    return this.applyNewAudio(src);
  }

  applyOnEvent(this){
    this.stop()
      .newElement(this)
      .highlights()
      .sendOrPlay(this);
  }

  send(text){
    this.abort();
    this.ajax = $.post(this.getAjaxOptions)
    .done(function(data){
      this.applyNewAudio(data[this.prop]);
    }.bind(this));

    return this;
  }

  makeAudio(src){
    this.speaker = new Audio(src);

    return this;
  }

  stop(){
    if(this.speaker != null){
      this.speaker.pause();
      this.speaker = null;
    }

    return this;
  }

  play(){
    if(this.speaker != null)
      this.speaker.play();

    return this;
  }

  applyNewAudio(src){
    return this.stop()
      .makeAudio(src)
      .play()
      .makeCacheOnCurrent();
  }

  makeCacheOnCurrent(data.src){
    if(this.cache)
      this.currentElement.data(this.cacheAttribute, src);

    return this;
  }

  highlight(){
    if(this.highlightFunctionExists && this.currentElementExists)
      this.highlightFunction(this.currentElement);

    return this;
  }

  clear(){
    if(this.clearFunctionExists && this.lastElementExists)
      this.clearFunction(this.lastElement);

    return this;
  }

  highlights(){
    return this.clear().highlight();
  }

  newElement(el){
    this.lastElement = this.currentElement;
    this.currentElement = $(el);

    return this.highlight();
  }


  // Helper
  static ConvertToArray(target){
    return Array.isArray(target) ? target : [target];
  }

}