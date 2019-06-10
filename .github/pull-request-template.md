> Generic PR Template
> Leave one the following titles if applies

## :wrench: Bugfix: {title}

## :recycle: Refactor: {title}

## :star: Feature: {title}

## :gear: Chore: {title}

### :link: Trello reference:

- [Title of the card](https://trello.com/)

---

### :information_source: Description:

> Add a description of the feature or bug you are tackling. First in high level perspective and then you can describe your solution. Include acceptance criteria, diagrams of the code, or anything else you consider that might help other developers understand your decisions.

---

### :camera: UI Preview:

> Add a UI Preview of the feature we are implementing, if corresponds. If may be an image, a gif, a video, etc. whatever is needed for the reviewer to get an ui overview of what's been done without having to checkout the branch and run the app.

---

### :pushpin: Notes:

> Include pending tasks, TODOs, assumptions, or comments like 'Needs migrating', or 'Requires ENV vars: [..]'

---

### :heavy_check_mark: Tasks:

> Include a medium-level tasking that summarizes the changes in the code

---

#### :warning: Warnings:

> Include a list of considerations for reviewers or future developers. For example:
> 
> - The feature in production triggers a service call so it will charge the account credit card
> - The service X is mocked so this part is not tested

---

## :gear: PR Checklists

### Development

- [ ] The code changed/added as part of this pull request has been covered with tests.
- [ ] All tests related to the changed code pass in development.
- [ ] All tests except for unrelated flaky tests pass in CircleCI.

### Code review 

- [ ] This pull request has a descriptive title and information useful to a reviewer. There may be a screenshot or screencast attached.
- [ ] Reviews have been requested.
- [ ] Changes have been reviewed and accepted by at least one other engineer.
- [ ] The Trello card has a link to this pull request.

---
