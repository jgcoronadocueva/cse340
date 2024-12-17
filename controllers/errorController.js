const errorController = {};


errorController.generateError = async function (req, res, next) {
    console.log("Error Triggered");
    // Simulate an intentional error
    const result = someNonExistentFunction();
}

module.exports = errorController;