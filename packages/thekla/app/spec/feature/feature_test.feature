Feature: Simple Feature File

  Test the feature Files

  @Smoke @Focus
  Scenario: Simple Search
    Given I search
    When I type it in
    Then it should appear

  @Smoke
  Scenario: Scneario without focus
    Given execute the spec without a focus
    When I start the test without focus tags
    Then it should not be executed