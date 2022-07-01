Feature: Feature with two scenarios

  @Scenario1_Tag1 @Scenario1_Tag2
  Scenario: Number One Scenario
    Given I have a feature file that fails
    When I execute the feature file
    Then I get results

  @Scenario2_Tag1 @Scenario2_Tag2
  Scenario: Number Two Scenario
    Given I have a feature file that passes
    When I execute the feature file
    Then I get results