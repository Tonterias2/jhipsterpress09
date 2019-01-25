describe('JhipsterPress Demo App', function () {

  it('Should login', function () {

    let htmltext = `<h2>What is JHipsterPress?</h2>
    <ul>
    <li>It is an open source and collaborative project made with Jhipster.</li>
    <li>It is a live project that it is explained in its GitHub project. Explained? What do you mean? Whether you are a beginner that wants to find out an example about how to <a href="https://github.com/Tonterias/JhipsterPress08/blob/master/ReadMe/Solution1.md" target="_blank"> How to open access to the REST Api:</a> or a more advance user who wants to see <a href=" https://github.com/Tonterias/JhipsterPress08/blob/master/ReadMe/Solution20.md" target="_blank"> How to change DTOs to load attributes of not related entities:</a> and see the actual code working, just visit the <a href="https://github.com/Tonterias/JhipsterPress08" target="_blank"> ReadMe file at GITHUB</a></li>
    <li>And YES, you can use it for your own website.</li>
    <li>At the same time JHipsterPress will try to create a community for Jhipster developers to join groups about different topics such as Websockets, Mapstruct, or anything you like.</li>
    </ul>
    <br />
    
    <h2>So, what is inside JHipsterPress?</h2>
    
    <p>The App is the combination of several sub-apps or parts: a newspaper with a blog and a meeting site (or grouping site). Let us start with a brief description of each part:</p>
    
    <ul>
    <li>Newspaper: The admin can manage the FrontPage of the site placing news that he considers interesting. This news can be general news, or specific ones about main interests or activities that are important for his or her gorup. A profile or a group can have a Blog, post news and users can comment those posts that would be grouped with tags and topics that are related with the interests and activities of the meeting site.</li>
    <li>Meeting site: A user can fill a profile detailing the activities or interest he has. He can follow other user with similar tastes, activities or sports, to join groups that meet together. A user, or group profile, can upload an Album with photographs. A profile can also receive messages and notifications.</li>
    <li>TODO: Proposals: Think of a proposal as a general idea. A user thinks about something that wants to present to other users for consideration, so he fills a proposal. This proposal could be explained in a Post and it can be voted by other users, a group or the general visitor.</li>
    <li>TODO: Bulletin Board: will be used to post offers and demands for things or services.</li>
    <li>Other ideas: I have a few more ideas, but first I would like to start with the ones already mentioned here.
    </ul>
    <p>It is really up to you. Join the groups and start using it.</p>`; 
    // let model = element(by.model("txt123")); 
    // model.sendKeys(text);

    browser.get("http://www.jhipsterpress.com/#/post/15/view");

    // ATENCION: browser.switchTo(). para cambiar a una alerta o otra ventana.
    // browser.sleep(2000);

    browser.actions().mouseMove(element(by.id("username")).sendKeys("admin")).perform();
    browser.actions().mouseMove(element(by.id("password")).sendKeys("admin2")).perform();
    browser.sleep(1000);

    browser.actions().sendKeys(protractor.Key.ENTER).perform().then(function () {

      browser.sleep(1000);
      browser.get("http://www.jhipsterpress.com/#/post/new");
      browser.sleep(1000);

      browser.actions().mouseMove(element(by.id("field_headline")).sendKeys("Headline Protractor Text1 12-18")).perform();
      browser.actions().mouseMove(element(by.id("field_leadtext")).sendKeys("LeadText Protractor Text1")).perform();
      element(by.id("field_bodytext")).sendKeys(htmltext);
      browser.actions().mouseMove(element(by.id("field_bodytext")).sendKeys(htmltext)).perform();
      browser.actions().mouseMove(element(by.id("field_quote")).sendKeys("QuoteText Protractor Text1")).perform();
      browser.actions().mouseMove(element(by.id("field_conclusion")).sendKeys("ConclusionText Protractor Text1")).perform();
      browser.actions().mouseMove(element(by.id("field_linkText")).sendKeys("field_linkText Protractor Text1")).perform();
      browser.actions().mouseMove(element(by.id("field_linkURL")).sendKeys("field_linkURL Protractor Text1")).perform();
      console.log('Vamos a por lo chungo');

      browser.actions().mouseMove(element(by.id("field_blog"))).perform();
      element(by.cssContainingText('option', 'WebSockets Blog')).click();
      console.log('Vamos a por lo chungo2');
      browser.actions().mouseMove(element(by.id("field_profile"))).perform();
      element(by.cssContainingText('option', '5')).click();
      browser.sleep(4000);
      console.log('Vamos a por EL SAVE');

      browser.actions().mouseMove(element(by.id("save-entity"))).perform();
      element(by.cssContainingText('span', 'Save')).click();
                  // [12:18:15] W/element - more than one element found for locator by.cssContainingText("span", "Save") - the first result will be used
                  // FA Jasmine spec timed out. Resetting the WebDriver Control Flow.


                  // Failures:
                  // 1) JhipsterPress Demo App Should login
                  //   Message:
                  //     Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
                  //   Stack:
                  //     Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
      browser.sleep(3000);
    })
  })
})

//<button class="jhiTranslate="entity.action.save"" id="save-entity" type="submit" disabled=""> <fa-icon class="ng-fa-icon"><svg aria-hidden="true" data-prefix="fas" data-icon="save" class="svg-inline--fa fa-save fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path></svg></fa-icon>&nbsp;<span jhitranslate="entity.action.save"><span>Save</span></span> </button>
  // describe('JhipsterPress Demo App', function() {
  //   it('Should login', function() {
  //       browser.get('http://www.jhipsterpress.com/#/post/15/view');

  //           element(by.id('username')).sendKeys('admin');
  //           element(by.id('password')).sendKeys('admin');
  //           var username = element(by.binding('username'));
  //           var password = element(by.binding('password'));
  //           element(by.css("button[class='btn btn-primary']")).click().then(function(){
  //           const EC = protractor.ExpectedConditions;
  //           // Waits max. 5 seconds for the input field to become clickable
  //           browser.wait(EC.elementToBeClickable(by.css("button[class='btn btn-primary']")), 5000);
  //       });
  //   });
  // });

//   element(by.id('login').click()).then(function(){
//     const EC = protractor.ExpectedConditions;
//     // Waits max. 5 seconds for the input field to become clickable
//     browser.wait(EC.elementToBeClickable(element(by.id('username')), 5000);
//     element(by.id('username')).sendKeys('admin');
//     ...
// });

// element(by.css("button[class='btn btn-primary']")).click();
// ========================================================================================================
//   describe('JhipsterPress Demo App', function() {
//     it('Should login', function() {
//         browser.get('http://www.jhipsterpress.com');

//         element(by.id('login')).click().then(function(){
//             browser.sleep(5000);
//             element(by.id('username')).sendKeys('admin');
//             browser.sleep(5000);
//             element(by.id('password')).sendKeys('admin');
//             browser.sleep(5000);
//             var username = element(by.binding('username'));
//             browser.sleep(5000);
//             var password = element(by.binding('password'));
//             browser.sleep(5000);
//         });     
//         browser.sleep(50000);
//     });
//   });