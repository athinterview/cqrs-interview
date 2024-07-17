# CQRS API interview assignment.

## Some decisions made during the development of this project

- Use decimals for prices in order to avoid floating point arithmetic issues.
- Whenever it made sense, all functions accept their dependencies as arguments, so that they can be easily tested.
- There is no transactions, sagas or event sourcing, so system failure may lead to inventory loss (eq. in order placement).
  - **Note**: the code attempts a rollback of the sales if the order placement fails. 
- With the current implementation and project structure, TDD would be a breeze, however due to time constraints, it chose not to follow it.
- End-to-end tests are not implemented, but they could be easily added. There would be no need to use module level mocks (like jest.mock()) to be able to test probably 99% of the code.
- Order pricing was not part of the requirements, but since there was a price field in the order item, I assumed it was necessary to calculate the total price of the order.
- I chose not to implement all basic CRUD operations for the entities, since it was not part of the requirements, only the parts needed to complete the assignement.
- I assumed products and orders are in separate domains, so I use CQRS queries to get the products for the orders in order to avoid unnecessary coupling between the two domains.
- Without using a framework, I chose not to add proper logging, as I didn't want to deal with more manual dependencies everywhere in the project. I do know using console.log/.error is considered bad practice.
- Order uses a lot of data structures to perform its task efficiently (maps and sets instead of arrays). Constructing all those auxiliary data structures takes code space and makes the code less readable.
  - One solution to the above problem would be to split this handler into smaller chucks, and use the main function to call a series of smaller steps. To look readable, it would require a context object holding all those structures and would add more coding time than I can spare.

## Running the project

```
npm install
npm run start
```
**OR**
```
docker build -t cqrs-interview .
docker run -p 5080:5080 cqrs-interview
```