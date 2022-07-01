import {Given, Then, When} from "cucumber";
import assert from "assert";

Given('I have a feature file that fails', function () {
    // Write code here that turns the phrase above into concrete actions
    // throw new Error('Something bad happened')
    assert.equal(1,3, "Values should be equal")
});

Given('I have a feature file that passes', function () {
    // Write code here that turns the phrase above into concrete actions
    // throw new Error('Something bad happened')
    assert.equal(1,1,"values should be equal")
});

When('I execute the feature file', function () {
    // Write code here that turns the phrase above into concrete actions
    return null;
});

Then('I get results', function () {
    // Write code here that turns the phrase above into concrete actions
    return null;
});