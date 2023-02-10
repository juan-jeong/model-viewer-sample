/** model-viewer */


const setModelViewer = () => {
    // 주소창에서 src 파라미터를 받아옵니다.
    var src = location.search.split('src=')[1];
    // id="ohouse-model-viewer"인 요소를 찾아서 src 파라미터를 적용한 model viewer를 생성합니다.
    const modelViewer = document.querySelector('model-viewer');
    modelViewer.src = src;
    document.getElementById('ohouse-model-viewer').appendChild(modelViewer);
};

// when the page is loaded, setModelViewer() is called.
window.onload = setModelViewer;