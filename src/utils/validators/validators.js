export const required = (value) => (value ? undefined : "Field is required");

export const maxLengthCreator = (maxLength) => (value) => {
    debugger
    if (parseInt(value) > maxLength) {
        
        return `${maxLength} pieces max NFT for 1 user`;
    }

    return undefined;
}