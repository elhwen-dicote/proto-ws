import { injectable, Container } from "@proto/di";

let id: number = 0;

class Arg { }

@injectable()
class Dependence {

    id: number = ++id;

    constructor() { }
    print() {
        return `Dependence::print id = ${this.id}`;
    }
}

@injectable()
class Dependent {

    id: number = ++id;

    constructor(
        private dependency: Dependence,
    ) { }
    print() {
        return `
    Dependent::print  id = ${this.id}
    dependence print : ${this.dependency.print()}`;
    }
}

const diparent = new Container();
const dichild1 = new Container(diparent)
const dichild2 = new Container(diparent)
dichild1.register(Dependent);
dichild2.register(Dependent);
diparent.register(Dependence);

{
    const dependent = dichild1.get<Dependent>(Dependent);
    console.log(dependent.print());
}
{
    const dependent = new Dependent(new Dependence());
    console.log(dependent.print());
}
{
    const dependent = dichild2.get<Dependent>(Dependent);
    console.log(dependent.print());
}
