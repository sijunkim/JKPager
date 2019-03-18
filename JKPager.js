/*
 * 기능 명세
 * 1. 이전, 숫자, 다음 버튼 클릭 시 해당 버튼이 가리키는 페이지로 페이저를 변경해줘야 함
 * 2. 페이저가 변경될 떄 변경이 필요한지 확인 후 필요할 때만 페이저를 변경해줘야 함
 * 3. 뒤로가기, 앞으로가기 기능을 지원해야 함
 */

var JKPager = JKPager || {};
JKPager.Setting = {
    page: 1, //현재 페이지
    pageItemCount: 10, //한 페이지에 나오는 아이템의 개수
    pageNoCount: 10, //페이저의 번호 개수
    currentArea: 0, //현재 페이지 영역
    totalItemCount: 0, //전체 아이템 개수
    nextPosition: 'f', //이전, 다음 버튼 클릭 이동 시 피봇의 위치 f:처음, e:마지막
    isAvailableHistoryBack: false, //window.historyback 기능을 지원 유무
    destination: '', //페이저가 만들어질 위치
    classTemplate: { //이전, 번호, 다음 버튼에 추가될 사용자 클래스
        front: '', //이전 버튼
        middle: '', //페이저 번호 버튼
        end: '' //다음 버튼
    },
    htmlTemplate: {
        //이전 버튼 template
        front: "<p><a href='#' class='tplBtn btnPgnPrev {$class}' data-nextPage='{$page}'><i class='ico'></i>이전</a></p>",
        //페이지 번호 버튼 template
        prefixMiddle: "<ul>",
        middle: "<li><a class='pageNo {$class}' data-nextPage='{$page}'>{$no}</a></li>",
        suffixMiddel: "</ul>",
        //페이지 번호 버튼 template
        now: "<li><a class='pageNo now {$class}' data-nextPage='{$page}'>{$no}</a></li>",
        //다음 버튼 template
        end: "<p><a href='#' class='tplBtn btnPgnNext {$class}' data-nextPage='{$page}'><i class='ico'></i>다음</a></p>"
    }
};
JKPager.Function = {
    CheckToChange: function (totalItemCount) {
        var result = false;
        var beforePageCount = 0, afterPageCount = 0;
        var setting = JKPager.Setting;
       
        //페이지 이동으로 인한 영역 변화
        if (setting.page > setting.pageNoCount) {
            if (setting.page % setting.pageItemCount === 0) {
                result = setting.currentArea !== setting.page / setting.pageItemCount - 1 ? true : false;
                setting.currentArea = setting.page / setting.pageItemCount - 1;
            } else {
                result = setting.currentArea !== setting.page / setting.pageItemCount ? true : false;
                setting.currentArea = setting.page / setting.pageItemCount;
            }
        } else {
            result = false;
            setting.currentArea = 0;
        }
        //아이템 개수 변화로 인한 영역 변화
        beforePageCount = (setting.totalItemCount % setting.pageItemCount === 0 ? 0 : 1) + setting.totalItemCount / setting.pageItemCount;
        afterPageCount = (totalItemCount % setting.pageItemCount === 0 ? 0 : 1) + totalItemCount / setting.pageItemCount;
        result = beforePageCount !== afterPageCount ? true : false;
       
        return result;
    },
    Render: function (destination) {
        var setting = JKPager.Setting;
        var quotient = parseInt((pageData.totalCount - (currentArea * setting.pageItemCount * setting.pageNoCount)) / setting.pageItemCount);
        var remainderExist = parseInt((pageData.totalCount - (currentArea * setting.pageItemCount * setting.pageNoCount)) % setting.pageItemCount) !== 0 ? true : false;
        var pageCnt = (remainderExist ? 1 : 0) + quotient;
        var length = pageCnt > setting.pageNoCount ? setting.pageNoCount : pageCnt;
 
        var tempNo, tempTemplate;
        var prevTemplate = "";
        var numberTemplate = "";
        var nextTemplate = "";
 
        //이전 버튼
        tempTemplate = setting.htmlTemplate.front.replace('{$class}', setting.classTemplate.front);
 
        tempNo = (setting.page / setting.pageItemCount - 1) * setting.pageItemCount + setting.nextPosition === 'f' ? 1 : 9;
 
        // if (setting.nextPosition === 'f') {
        //     tempNo = (setting.page / setting.pageItemCount - 1) * setting.pageItemCount + 1;
        // }
        // else {
        //     tempNo = (setting.page / setting.pageItemCount - 1) * setting.pageItemCount + 9;
        // }
 
        prevTemplate = tempTemplate.replace('{$page}', tempNo);
 
        //페이지 번호 버튼
        numberTemplate += setting.htmlTemplate.prefixMiddle;
        for (var i = 1; i <= length; i++) {
            if (i + (setting.currentArea * setting.pageItemCount) == setting.page) {
                tempTemplate = setting.htmlTemplate.now;
            }
            else {
                tempTemplate = setting.htmlTemplate.middle;
            }
            tempNo = i + (setting.currentArea * setting.pageItemCount);
            tempTemplate.replace('{$class}', setting.classTemplate.middle);
            tempTemplate.replace('{$page}', tempNo);
            tempTemplate.replace('{$no}', tempNo);
            numberTemplate += tempTemplate;
        }
        numberTemplate += setting.htmlTemplate.suffixMiddel;
 
        //다음 버튼
        tempTemplate = setting.htmlTemplate.front.replace('{$class}', setting.classTemplate.front);
 
        tempNo = (setting.page / setting.pageItemCount + 1) * setting.pageItemCount + setting.nextPosition === 'f' ? 1 : 9;
 
        // if (setting.nextPosition === 'f') {
        //     tempNo = (setting.page / setting.pageItemCount + 1) * setting.pageItemCount + 1;
        // }
        // else {
        //     tempNo = (setting.page / setting.pageItemCount + 1) * setting.pageItemCount + 9;
        // }
 
        nextTemplate = tempTemplate.replace('{$page}', tempNo);
 
        $(destination).empty().html((setting.currentArea > 0 ? prevTemplate : '') + numberTemplate + (pageCnt > setting.pageNoCount ? nextTemplate : ''));
    }
};
 
