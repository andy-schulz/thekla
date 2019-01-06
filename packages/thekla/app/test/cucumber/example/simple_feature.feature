Feature: Example Feature File

  Test that Thekla can execute tests with cucumber

  @Smoke @Focus
  Scenario: Simple Example
    Given I want to use thekla with cucumber
    When I start thekla
    Then I should see 3 console logs