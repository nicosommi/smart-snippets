Feature: File Synchronization

  Scenario: A Smart Snippet is saved from your working file
    Given a valid archetype path on 'file'
      And passes 'file' as the 'base' argument
    When the user executes the command smart-snippets 'save'
    Then it should save a file named as the archetype in the 'default' workspace
  
  Scenario: A file is asked to be updated by the appropiate archetype
    Given a valid old archetype path on 'file'
      And a valid archetype path on 'archetype'
      And an existing archetype from 'archetype'
      And passes 'file' as the target argument
      And passes 'archetype' as the 'base' argument
    When the user executes the command smart-snippets 'update'
    Then it should refresh the file to the last version of it

  # Scenario: An empty file is asked to be updated with an existing Smart Snippet
  # Scenario: An existing file is asked to be updated with an existing Smart Snippet
  # Scenario: An existing file is asked to be updated with a non existing Smart Snippet

