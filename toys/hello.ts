const greeter = (person: string) => {
    return `Hello, ${person}!`;
}

function testGreeter() {
    const user = 'Grant';
    console.log(greeter(user));
}
