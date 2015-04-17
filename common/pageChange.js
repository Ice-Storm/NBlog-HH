function pageChange (count, currentPage, pageSize) {
	var pageInfo = {};
	var hasNextPage = false;
	var hasPreviousPage = false;

	if ((count % pageSize) == 0) {
		pageInfo.totalPage = count / pageSize;
	} else {
		pageInfo.totalPage = Math.ceil(count / pageSize);					
	}

	if(currentPage >= pageInfo.totalPage) {
		hasNextPage = false;
		pageInfo.currentPage = pageInfo.totalPage;
	} else {
		hasNextPage = true;
	}

	if (currentPage <= 1) {
		hasPreviousPage = false;
		currentPage = 1;
	} else {
		hasPreviousPage = true;
	}

	pageInfo.nextPage = currentPage + 1;

	if (pageInfo.nextPage >= pageInfo.totalPage) {
		pageInfo.nextPage = pageInfo.totalPage;
	}

	pageInfo.previousPage = currentPage - 1;

	if (pageInfo.previousPage <= 1) {
		pageInfo.previousPage = 1;
	}

	return pageInfo;
}

module.exports.pageChange = pageChange;