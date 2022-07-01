Feature: Feature with a single scenario


  @Scenario1_Tag1 @Scenario1_Tag2
  Scenario: Number One
    Given I have a feature file
    When I execute the feature file with a non existing step definition
    Then I get results