const { Given, When, Then } = require('cucumber');

Given(/^I want to use thekla with cucumber$/, function() {
    console.log("GIVEN Step executed!");
    return Promise.resolve();
});
When(/^I start thekla$/, function() {
    console.log("WHEN Step executed!");
    return Promise.resolve()
});

Then(/^I should see 3 console logs$/, function() {
    console.log("THEN Step executed!");
    return Promise.resolve()
});