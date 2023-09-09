const transformPhone = (phone: string, code = "+234") => {
    phone.replace(/\s/g, "");
    const lastTen = phone.substring(phone.length - 10);
    const fullNumber = `${code}${lastTen}`;
    return fullNumber;
};

export default transformPhone;
