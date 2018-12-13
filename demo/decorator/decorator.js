function appLoggingOne(component) {
    component.prototype.logger = () => `${component.name} log one.`;
}

function appLogginTwo(component) {
    component.prototype.logger2 = () => `${component.name} log two.`; 
}

@appLoggingOne
class App {
    method() {
        console.info("App method");
    }
}


@appLoggingOne
@appLogginTwo
class App2 {
    method() {
        console.info("App2 method.")
    }
}
