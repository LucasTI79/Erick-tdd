const { describe, it, before, afterEach } = require('mocha');
const { expect } = require('chai');
const TodoService = require('../src/todoService');
const { createSandbox } = require('sinon');
const Todo = require('../src/todo');

describe('todoService', () => {
    describe('methods signature', () => {
      let sandbox;
      before(() => {
        sandbox = createSandbox();
      });

      afterEach(() => sandbox.restore());
      
      describe('#list', () => {
        const mockDb = [
          {
            name: 'XuxadaSilva',
            age: 90,
            meta: { revision: 0, created: 1611501086654, version: 0 },
            '$loki': 1
          },
        ];
        let todoService;

        beforeEach(() => {
          const dependencies = {
            todoRepository: {
              list: sandbox.stub().returns(mockDb),
            }
          }
          todoService = new TodoService(dependencies);
        });
        it('should return date on a specific format', () => {
            const result = todoService.list();
            const [ { meta, $loki, ...expected } ] = mockDb;

            expect(result).to.be.deep.equal([expected]);
        });

      });

      describe('#create', () => {
        let todoService;
        beforeEach(() => {
          const dependencies = {
            todoRepository: {
              create: sandbox.stub().returns(true),
            }
          }
          todoService = new TodoService(dependencies);
        });


      it('shouldn\'t save todo item with invalid data', () => {
        const data = new Todo({
          text:'',
          when:''
        });

        Reflect.deleteProperty(data, "id");
        const expected = {
          error: {
            message: 'invalid data',
            data: data,
          }
        }

        const result = todoService.create(data);
      
        expect(result).to.be.deep.equal(expected);
      })

      it('should save todo item with late status when poperty is further than today', () => {
        const prop = {
          text: 'I must walk my dog',
          when: new Date('2020-12-01 12:00:00 GMT-0'),
        }
    
        const expectedId = '000001';

        const uuid = require('uuid');
        const fakeUUID = sandbox.fake.returns(expectedId);
        sandbox.replace(uuid, "v4"  , fakeUUID);

        const data = new Todo(prop);

        const today = new Date('2020-12-02');
        sandbox.useFakeTimers(today.getTime());

        todoService.create(data);

        const expectedCallWith = {
          ...data,
          status: 'late'
        }

        expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok;
      })

      it('should save todo item with pending status', () => {
        const prop = {
          text: 'I must walk my dog',
          when: new Date('2020-12-10 12:00:00 GMT-0'),
        }
    
        const expectedId = '000001';

        const uuid = require('uuid');
        const fakeUUID = sandbox.fake.returns(expectedId);
        sandbox.replace(uuid, "v4"  , fakeUUID);

        const data = new Todo(prop);

        const today = new Date('2020-12-02');
        sandbox.useFakeTimers(today.getTime());

        todoService.create(data);

        const expectedCallWith = {
          ...data,
          status: 'pending'
        }

        expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok;
      })
      });      
    })
})