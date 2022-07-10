import { httpFetchFactory, resolveJsonResponseFactory } from '../src/io.js';

describe('io.js', () => {

    describe('httpFetch()', () => {
        let request, https, resolveJsonResponse;
        beforeEach(() => {
            request = {
                on: jest.fn(),
                write: jest.fn(),
                end: jest.fn()
            };
            https = {
                request: jest.fn((_, cb) => {
                    cb();
                    return request;
                })
            };
            resolveJsonResponse = jest.fn(() => () => { });
        });

        it('makes a simple https request', () => {
            expect.assertions(1);
            resolveJsonResponse = jest.fn((resolve) => () => {
                resolve({ foo: 'bar' });
            });

            const fetch = httpFetchFactory(https, resolveJsonResponse);

            return fetch('', {}).then(data => {
                expect(data).toEqual({ foo: 'bar' });
            });
        });

        it('makes a https post', () => {
            const fetch = httpFetchFactory(https, resolveJsonResponse);

            fetch('', {}, 'some data');

            expect(request.write).toHaveBeenCalledTimes(1);
            expect(request.write).toHaveBeenCalledWith('some data');
        });

        it('does not call request.write(data) if no data to send', () => {
            const fetch = httpFetchFactory(https, resolveJsonResponse);

            fetch('', {});

            expect(request.write).toHaveBeenCalledTimes(0);
        });


        it('calls https.request with correct options on POST', () => {
            const fetch = httpFetchFactory(https, resolveJsonResponse);
            const options = { host: 'example.com', path: '/test', method: 'POST' };

            fetch('', options, 'some data');

            expect(https.request.mock.calls.length).toBe(1);
            expect(https.request.mock.calls[0][0]).toEqual({
                headers: {
                    'Accept': 'application/json',
                    'Content-Length': 9,
                    'Content-Type': 'application/json'
                },
                host: 'example.com',
                method: 'POST',
                path: '/test',
                port: 443,
            });
        });

        it('calls https.request with correct options on GET', () => {
            const fetch = httpFetchFactory(https, resolveJsonResponse);
            const options = { host: 'example.com', path: '/test' };

            fetch('', options);

            expect(https.request.mock.calls.length).toBe(1);
            expect(https.request.mock.calls[0][0]).toEqual({
                headers: { 'Accept': 'application/json' },
                host: 'example.com',
                method: 'GET',
                path: '/test',
                port: 443,
            });
        });

        it('calls https.ClientRequest.end()', () => {
            const fetch = httpFetchFactory(https, resolveJsonResponse);

            const options = { host: 'example.com', path: '/test' };
            fetch('', options);

            expect(request.end.mock.calls.length).toBe(1);
        });

        it('handles request error event', () => {
            expect.assertions(2);
            request.on = jest.fn((event, cb) => {
                if (event === 'error') cb(new Error('expected error'));
            });
            const fetch = httpFetchFactory(https, resolveJsonResponse);

            const result = fetch('MyRequest', {});

            return result.catch(error => {
                expect(error.message).toBe('MyRequest: Request Failed');
                expect(error.cause.message).toBe('expected error');
            });
        });

        it('handles resolveJsonResponse error event', () => {
            expect.assertions(1);
            resolveJsonResponse = jest.fn((_, reject, name) => () => {
                reject(new Error(name + ': expected error'));
            });
            const fetch = httpFetchFactory(https, resolveJsonResponse);

            const result = fetch('MyRequest', {});

            return result.catch(error => {
                expect(error.message).toBe('MyRequest: expected error');
            });
        });
    });

    describe('resolveJsonResponseFactory()', () => {
        let response;
        beforeEach(() => {
            response = {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json'
                },
                setEncoding: jest.fn(),
                on: jest.fn(),
                resume: jest.fn()
            };
        });

        it('rejects if statusCode is not 200', () => {
            expect.assertions(1);
            return new Promise((resolve, reject) => {
                const resolveResponse = resolveJsonResponseFactory(resolve, reject, 'MyRequest');
                response.statusCode = 400;
                resolveResponse(response);
            }).catch(error => {
                expect(error.message).toBe('MyRequest: Request Failed.\nStatus Code: 400');
            });
        });

        it('rejects if content is not JSON', () => {
            expect.assertions(1);
            return new Promise((resolve, reject) => {
                const resolveResponse = resolveJsonResponseFactory(resolve, reject, 'MyRequest');
                response.headers['content-type'] = 'text/plain';
                resolveResponse(response);
            }).catch(error => {
                expect(error.message).toBe('MyRequest: Invalid content-type.\nExpected application/json but received text/plain');
            });
        });

        it('calls response.resume() on reject to consume response data and free up memory', () => {
            expect.assertions(1);
            return new Promise((resolve, reject) => {
                const resolveResponse = resolveJsonResponseFactory(resolve, reject, 'MyRequest');
                response.statusCode = 400;
                resolveResponse(response);
            }).catch(() => {
                expect(response.resume).toHaveBeenCalledTimes(1);
            });
        });

        it('calls response.resume() on reject to consume response data and free up memory', () => {
            expect.assertions(1);
            return new Promise((resolve, reject) => {
                const resolveResponse = resolveJsonResponseFactory(resolve, reject, 'MyRequest');
                response.headers['content-type'] = 'text/plain';
                resolveResponse(response);
            }).catch(() => {
                expect(response.resume).toHaveBeenCalledTimes(1);
            });
        });

        it('set response encoding to utf8', () => {
            expect.assertions(2);
            return new Promise((resolve, reject) => {
                const resolveResponse = resolveJsonResponseFactory(resolve, reject, 'MyRequest');
                let dataCallback, endCallback;
                response.on = jest.fn((event, cb) => {
                    if (event === 'data') dataCallback = cb;
                    if (event === 'end') endCallback = cb;
                });
                resolveResponse(response);
                dataCallback('{}');
                endCallback();
            }).then(() => {
                expect(response.setEncoding).toHaveBeenCalledTimes(1);
                expect(response.setEncoding).toHaveBeenCalledWith('utf8');
            });
        });

        it('parses JSON response', () => {
            expect.assertions(1);
            return new Promise((resolve, reject) => {
                const resolveResponse = resolveJsonResponseFactory(resolve, reject, 'MyRequest');
                let dataCallback, endCallback;
                response.on = jest.fn((event, cb) => {
                    if (event === 'data') dataCallback = cb;
                    if (event === 'end') endCallback = cb;
                });
                resolveResponse(response);
                dataCallback('{"foo');
                dataCallback('":"bar"}');
                endCallback();
            }).then(result => {
                expect(result).toEqual({ foo: 'bar' });
            });
        });

        it('rejects if JSON parsing fails', () => {
            expect.assertions(2);
            return new Promise((resolve, reject) => {
                const resolveResponse = resolveJsonResponseFactory(resolve, reject, 'MyRequest');
                let dataCallback, endCallback;
                response.on = jest.fn((event, cb) => {
                    if (event === 'data') dataCallback = cb;
                    if (event === 'end') endCallback = cb;
                });
                resolveResponse(response);
                dataCallback('this is not JSON');
                endCallback();
            }).catch(error => {
                expect(error.message).toEqual('MyRequest: Failed parsing json response');
                expect(error.cause.message).toEqual('Unexpected token h in JSON at position 1');
            });
        });
    });
});