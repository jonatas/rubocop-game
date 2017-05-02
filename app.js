
var game = {
    start: function(cops){
        $("#game").show();
        this.cops = cops
        this.level = 0
        this.score = {
            success: 0,
            fail: 0
        }
        this.pickRandom()
    },
    pickRandom: function(){
        this.currentIndex = parseInt(Math.random() * app.cops.length) - 1
        this.level = this.cops[this.currentIndex]
        if (this.level.examples.length == 0)
            return this.pickRandom()
        this.displayGame()
    },
    randomGoodOrBad: function() {
        this.currentLevelGood = Math.random() > 0.5
        key = this.currentLevelGood ? "good" : "bad"
        return this.level.examples[key][0]
    },
    displayGame: function(){
        randomCode = this.randomGoodOrBad();
        html = Prism.highlight(randomCode, Prism.languages.ruby)
        this.code = html
        $("pre#code").html(html);
        $("#help-message").text("")
        $("#help").hide()
        $("#title").text("Good or Bad?")
        $("#official_documentation").prop("href","#")
        $("button#good, button#bad")
            .css("background-color", "")
            .prop('disabled', false)
    },
    currentLevelIsGood: function() {
        return this.currentLevelGood;
    },
    success: function() {
        if (this.failedLastTime) {
            this.failedLastTime = false
        } else {
            this.score.success += 1
            this.showResult(true)
        }
        this.pickRandom()
    },

    fail: function(from) {
        this.score.fail += 1
        this.failedLastTime = true
        this.showHelp()
        this.showResult(false)

        buttonSelector = "button#"+from
        $(buttonSelector)
            .css("background-color", "red")
            .prop("disabled", "true")
    },

    showHelp: function(){
        $("#help-message").text(this.level.description)
        $("#title").text(this.level.name)
        this.showReadMore()
        $("#help").show()
    },
    showReadMore: function(){
        department = this.level.department.toLowerCase()
        id = this.level.name.replace('/','').toLowerCase()
        url = 'https://rubocop.readthedocs.io/en/latest/cops_'
        $("#official_documentation").prop('href',url + department+"#"+id)
    },
    showResult: function(ok) {
       result = $("<div/>")
       result.addClass("result")
       result.addClass(ok ? "success" : "error")
       $(".results").append(result)
    }
}

var app = {
    load: function() {
        $("#game").hide()
        $("button#start").text('Loading...');
        $("button#start").prop('disabled', true)

        self = this;
        $.get('data/cops.json', function(cops){
            self.cops = cops;
            self.start()
        })
    },
    start: function() {
        $("button#start").text('Play Game');
        $("button#start").prop('disabled', false)

   },
    play: function() { 
        game.start(app.cops)
        $("button#start").hide()
        $("#game").show()
    },
    good: function() {
      if (game.currentLevelIsGood())
        game.success()
      else{
        game.fail('good')
      }
    },
    bad: function() {
      if (!game.currentLevelIsGood())
        game.success()
      else {
        game.fail('bad')
      }
    }
}
window.onload = function(){
  app.load()
}
