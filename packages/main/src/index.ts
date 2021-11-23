import { injectable, Container, inject } from "@proto/di";

let id: number = 0;

const message1_token = "main:message1";
const message1: string = "message 1 test";
const message2_token = "main:message2";
const message2: string = "message 2 test";

class Arg { }

@injectable()
class Dependence {

    id: number = ++id;

    constructor(@inject(message1_token) private readonly message: string,) { }
    print() {
        return `Dependence::print id = ${this.id} -> ${this.message}`;
    }
}

@injectable()
class Dependent {

    id: number = ++id;

    constructor(
        private dependency: Dependence,
        @inject(message2_token) private message: string,
    ) { }
    print() {
        return `
    Dependent::print  id = ${this.id} -> ${this.message}
    dependence print : ${this.dependency.print()}`;
    }
}

const diparent = new Container();
const dichild1 = new Container(diparent);
const dichild2 = new Container(diparent);
dichild1.register(Dependent);
dichild1.register({ provide: message2_token, useValue: message2 });
dichild2.register(Dependent);
dichild2.register({ provide: message2_token, useValue: message2 });
diparent.register(Dependence);
diparent.register({ provide: message1_token, useValue: message1 });

{
    const dependent = dichild1.get<Dependent>(Dependent);
    console.log(dependent.print());
}
{
    const dependent = new Dependent(new Dependence(message1), message2);
    console.log(dependent.print());
}
{
    const dependent = dichild2.get<Dependent>(Dependent);
    console.log(dependent.print());
}
