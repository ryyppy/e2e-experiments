Feature: Github Demo

  Scenario: Listing Pull Requests
    When User navigates to the "rescript-lang/rescript-compiler" project page
    And User selects the Pull Request tab
    Then The user should see the Pull Request list


