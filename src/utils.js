export const generateID = () => {
    return "" + Date.now() + Math.floor(Math.random() * 100);
};
