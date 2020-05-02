const bcrypt = require("bcrypt");
module.exports = {
  Exception: function Exception(message) {
    this.message = message;
  },
  hashPassword: plainPassword => {
    return bcrypt.hash(plainPassword, 10);
  },
  verifyPassword(hashPassword, plainPassword) {
    return bcrypt.compare(plainPassword, hashPassword);
  },
  /**
   * generate value of pagination
   * @param {number} page current page
   * @param {number } paginationSizes size of a pagination bar
   * @param {number} numPages number of pages
   */
  generatePagination(page, paginationSizes, numPages) {
    let startLink = -1;
    // add skip '...'
    let addition = {
      start: false, // add skip at start
      end: false // add skip at end
    };
    if (page < paginationSizes) {
      // current page  at start
      startLink = 0;
      addition.end = numPages > paginationSizes ? true : false;
    } else if (numPages - page <= paginationSizes) {
      // current page  at end
      startLink = numPages - paginationSizes;
      addition.start = true;
    } else {
      // current page  at middle
      startLink = Math.floor(page / paginationSizes) * paginationSizes;
      addition.start = true;
      addition.end = true;
    }
    let pageLinks = Array.from({ length: paginationSizes }, (_, index) => {
      return startLink + index;
    });

    if (addition.start) {
      pageLinks.unshift(0, false);
    }

    if (addition.end) {
      pageLinks.push(false, numPages - 1);
    }
    return pageLinks;
  },
  /**
   * Check file is image of ['image/png', 'image/jpeg']
   * @param {string} mimetype
   */
  checkIsImage(mimetype) {
    const acceptImageTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/x-icon"
    ];
    return acceptImageTypes.includes(mimetype);
  }
};
