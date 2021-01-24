const { describe, it, before, afterEach } = require('mocha');
const { expect } = require('chai');
const TodoRepository = require('../src/todoRepository');
const { createSandbox } = require('sinon');

describe('todoRepository', () => {
    describe('methods signature', () => {
      let todoRepository;
      let sandbox;
      before(() => {
        todoRepository = new TodoRepository();
        sandbox = createSandbox();
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('should call find from lokijs', () => {
        const mockDb = [
          {
            name: 'XuxadaSilva',
            age: 90,
            meta: { revision: 0, created: 1611501086654, version: 0 },
            '$loki': 1
          },
          {
            name: 'Joaozinho',
            age: 90,
            meta: { revision: 0, created: 1611501086654, version: 0 },
            '$loki': 2
          }
        ];

        const fnName = "find";
        const expectedReturn = mockDb;
        sandbox.stub(
          todoRepository.schedule,
          fnName
          ).returns(expectedReturn);
        
          const result = todoRepository.list();
          expect(result).to.be.deep.equal(expectedReturn);
          expect(todoRepository.schedule[fnName].calledOnce).to.be.ok;
      });

      it('should call insertOne from lokijs', () => {
        const fnName = "insertOne";
        const expectedReturn = true;

        sandbox.stub(
          todoRepository.schedule,
          fnName
          ).returns(expectedReturn);

          const data = { name: 'Lucas' };
          const result = todoRepository.create(data);

          expect(result).to.be.deep.equal(expectedReturn);
          expect(todoRepository.schedule[fnName].calledOnceWithExactly(data)).to.be.ok;
      });
     
    })
});


