(function() {
    'use strict';

    // Tạo và thêm HTML vào TradingView
    const containerHTML = `
        <div id="hn-lotCalculator" class="hn-lot-calculator">
            <h1 style="display: flex; justify-content: space-between; align-items: center;">
                <span>Công Cụ Tính Lot</span>
                <span id="hn-closeButton" style="cursor: pointer; color: red; padding: 5px 10px;" title="Đóng">X</span>
            </h1>
            <form id="hn-lotForm">
                <div class="hn-form-group">
                    <div class="hn-form-label">
                        <label for="currencyPair">Cặp Tiền:</label>
                    </div>
                    <div class="hn-form-input">
                        <select id="hn-currencyPair">
                            <option value="USD">xxxUSD</option>
                            <option value="XAU">XAUUSD</option>
                            <option value="BTC">BTCUSD</option>
                            <option value="XTI">XTIUSD</option>
                            <option value="JPY">xxxJPY</option>
                            <option value="CAD">xxxCAD</option>
                            <option value="AUD">xxxAUD</option>
                            <option value="GBP">xxxGBP</option>
                            <option value="NZD">xxxNZD</option>
                            <option value="CHF">xxxCHF</option>
                        </select>
                    </div>
                </div>
                <div class="hn-form-group">
                    <div class="hn-form-label">
                        <label for="capital">Vốn (USD):</label>
                    </div>
                    <div class="hn-form-input">
                        <input type="number" id="hn-capital" step="0.01" required>
                    </div>
                </div>
                <div class="hn-form-group">
                    <div class="hn-form-label">
                        <label for="riskPercentage">Rủi Ro (%):</label>
                    </div>
                    <div class="hn-form-input">
                        <input type="number" id="hn-riskPercentage" step="0.01" required>
                    </div>
                </div>
                <div class="hn-form-group">
                    <div class="hn-form-label">
                        <label for="entryPrice">
                            <button type="button" id="hn-copyEntryPrice" title="Sao chép giá Entry">Giá Entry:</button>
                        </label>
                    </div>
                    <div class="hn-form-input">
                        <input type="number" id="hn-entryPrice" step="0.0001" required>
                    </div>
                </div>
                <div class="hn-form-group">
                    <div class="hn-form-label">
                        <label for="profitPrice">
                            <button type="button" id="hn-copyProfitPrice" title="Sao chép giá TP">Giá TP:</button>
                        </label>
                    </div>
                    <div class="hn-form-input">
                        <input type="number" id="hn-profitPrice" step="0.0001" required>
                    </div>
                </div>
                <div class="hn-form-group">
                    <div class="hn-form-label">
                        <label for="stopLossPrice">
                            <button type="button" id="hn-copyStopLossPrice" title="Sao chép giá SL">Giá SL:</button>
                        </label>
                    </div>
                    <div class="hn-form-input">
                        <input type="number" id="hn-stopLossPrice" step="0.0001" required>
                    </div>
                </div>
            </form>
            <div class="hn-alert" id="hn-alert"></div>
            <div class="hn-result" id="hn-result"></div>
            <div class="hn-footer">
                <p><span class="hn-heart">&#10084;</span> Kieptrader</p>
            </div>
        </div>
    `;

    // Thêm HTML vào body
    document.body.insertAdjacentHTML('beforeend', containerHTML);

    // Thêm CSS cho form
    const style = document.createElement('style');
    style.textContent = `
        .hn-lot-calculator {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 260px;
            background: #141823;
            border: 1px solid #666;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            cursor: move;
            display: flex;
            flex-direction: column;
            color: #fff;
        }
        .hn-footer {
            margin-top: auto;
            text-align: right;
            font-size: 12px;
            color: #aaa;
        }

        .hn-heart {
            color: #ff0000;
            font-size: 14px;
        }
        .hn-lot-calculator h1 {
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .hn-form-group {
            display: flex;
            margin-bottom: 10px;
        }
        .hn-form-label {
            flex: 1;
            padding-right: 10px;
        }
        .hn-form-input {
            flex: 2;
        }
        .hn-form-input input, .hn-form-input select {
            width: 100%;
            padding: 5px;
            box-sizing: border-box;
            background-color: #808080;
        }
        .hn-alert, .hn-result {
            margin-top: 10px;
        }
        .hn-result p {
            padding-top: 3px;
            padding-bottom: 3px;
        }
        .hn-alert p {
            color: #6495ed;
        }
        #hn-copyEntryPrice, #hn-copyProfitPrice, #hn-copyStopLossPrice {
            margin-top: 5px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #hn-copyEntryPrice:hover, #hn-copyProfitPrice:hover, #hn-copyStopLossPrice:hover, .hn-copy-all-btn:hover {
            background-color: #0056b3;
        }
        .hn-copy-all-btn {
            padding: 6px;
            margin-right: 10px;
            border-radius: 6px;
            background-color: #007bff;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Tỷ giá cặp tiền với USD 11/09/2024
    const exchangeRates = {
        USD: 1.00,
        JPY: 141.66,
        CAD: 1.36,
        AUD: 1.50,
        GBP: 0.77,
        NZD: 1.63,
        CHF: 0.85
    };

    const LOT_DATA_KEY = 'lotCalculatorData';
    const LOT_POSITION_KEY = 'lotCalculatorPosition';

    function getLocalData() {
        const storedData = localStorage.getItem(LOT_DATA_KEY);
        return storedData ? JSON.parse(storedData) : {};
    }

    function displayResult(title, pipRisk, lotSize, maxRiskUSD, rrRatio) {
        const minLotSize = 0.01;

        // Tính toán kích thước lot nửa trước
        const halfLotSize = Math.max(lotSize / 2, minLotSize);
        // Đảm bảo lotSize không nhỏ hơn minLotSize
        lotSize = Math.max(lotSize, minLotSize);

        // Tạo chuỗi hiển thị cho QTV nếu rrRatio > 1
        const qtvDisplay = rrRatio > 1 ? `<span title="Cắt nửa lot khi 1:1">(QTV: ${calculateActualRR(rrRatio).toFixed(1)})</span>` : '';

        // Tạo chuỗi hiển thị cho phần chia đôi lot nếu lotSize > 0.01
        const halfLotSizeDisplay = lotSize > 0.015 ? `(Chia đôi: <span style="color:red">${halfLotSize.toFixed(2)})` : '';

        document.getElementById('hn-result').innerHTML = `
            <h2>${title}</h2>
            <p>Lot: <span style="color:red">${lotSize.toFixed(2)}</span> ${halfLotSizeDisplay}</p>
            <p>Số USD SL: ${maxRiskUSD}</p>
            <p>Số Pip SL: ${pipRisk.toFixed(1)}</p>
            <p>RR: ${rrRatio.toFixed(2)} ${qtvDisplay}</p>
        `;
    }

    function calculateActualRR(targetR) {
        if (targetR <= 1) {
            return targetR; // Nếu mục tiêu là 1R hoặc nhỏ hơn, giữ nguyên
        }

        const profitFirstHalf = 0.5; // Lợi nhuận từ phần lot đầu tiên (1R)
        const profitRemaining = targetR * 0.5; // Lợi nhuận từ phần lot còn lại
        const totalProfit = profitFirstHalf + profitRemaining; // Tổng lợi nhuận thực tế

        return totalProfit;
    }

    function calculateLot() {
        const capital = parseFloat(document.getElementById('hn-capital').value);
        const riskPercentage = parseFloat(document.getElementById('hn-riskPercentage').value);
        const entryPrice = parseFloat(document.getElementById('hn-entryPrice').value);
        const profitPrice = parseFloat(document.getElementById('hn-profitPrice').value);
        const stopLossPrice = parseFloat(document.getElementById('hn-stopLossPrice').value);
        const pair = document.getElementById('hn-currencyPair').value;
        const exchangeRate = exchangeRates[pair];

        localStorage.setItem(LOT_DATA_KEY, JSON.stringify({
            currencyPair: pair,
            capital,
            riskPercentage
        }));

        // Kiểm tra xem tất cả các giá trị có hợp lệ không
        if (isNaN(capital) || isNaN(riskPercentage) || isNaN(entryPrice) || isNaN(profitPrice) || isNaN(stopLossPrice) || !pair) {
            document.getElementById('hn-result').innerHTML = '<p>Vui lòng điền đầy đủ thông tin.</p>';
            return;
        }

        const rewardPips = Math.abs(profitPrice - entryPrice); // Khoảng cách từ Entry đến TP
        const riskPips = Math.abs(entryPrice - stopLossPrice); // Khoảng cách từ Entry đến SL
        const rrRatio = rewardPips / riskPips; // Tỷ lệ R:R

        const maxRiskUSD = Math.round(capital * (riskPercentage / 100));
        const pipSize = (pair === 'JPY') ? 0.01 : 0.0001;
        const isGoldOil = ['XAU', 'XTI'].includes(pair);
        const isBTC = pair === 'BTC';

        let pipRisk, pipValueUSD, lotSize;

        if (isGoldOil) {
            pipRisk = riskPips / 0.01;
            lotSize = maxRiskUSD / pipRisk;
            displayResult(pair === 'XAU' ? `Vàng ${pair}` : `Dầu ${pair}`, pipRisk, lotSize, maxRiskUSD, rrRatio);
        } else if (isBTC) {
            pipRisk = riskPips;
            lotSize = maxRiskUSD / pipRisk;
            displayResult('Bitcoin', pipRisk, lotSize, maxRiskUSD, rrRatio);
        } else {
            if (!exchangeRate) {
                document.getElementById('hn-result').innerHTML = '<p>Tỷ giá không hợp lệ. Vui lòng kiểm tra lại.</p>';
                return;
            }

            pipRisk = riskPips / pipSize;
            pipValueUSD = pipSize * 100000 / exchangeRate;
            lotSize = maxRiskUSD / (pipRisk * pipValueUSD);
            displayResult(`Cặp Tiền ${pair}`, pipRisk, lotSize, maxRiskUSD, rrRatio);
        }
    }

    function getCurrencyUnit() {
        // Tìm tất cả các thẻ có thể chứa cặp tiền tệ
        const unitElement = document.querySelector('#header-toolbar-symbol-search > div[class*="text-"]');

        if (!unitElement) {
            return '';
        }

        const textContent = unitElement.textContent.trim();

        // Kiểm tra các cặp tiền tệ cụ thể
        let currencyUnit = '';

        if (textContent === 'XAUUSD') {
            currencyUnit = 'XAU';
        } else if (textContent === 'BTCUSD' || textContent === 'BTCUSDT') {
            currencyUnit = 'BTC';
        } else if (textContent === 'XTIUSD') {
            currencyUnit = 'XTI';
        } else if (textContent.endsWith('USD')) {
            currencyUnit = 'USD';
        } else if (textContent.endsWith('JPY')) {
            currencyUnit = 'JPY';
        } else if (textContent.endsWith('CAD')) {
            currencyUnit = 'CAD';
        } else if (textContent.endsWith('AUD')) {
            currencyUnit = 'AUD';
        } else if (textContent.endsWith('GBP')) {
            currencyUnit = 'GBP';
        } else if (textContent.endsWith('NZD')) {
            currencyUnit = 'NZD';
        } else if (textContent.endsWith('CHF')) {
            currencyUnit = 'CHF';
        }

        // Nếu không khớp với bất kỳ trường hợp nào, hiển thị thông báo và trả về giá trị mặc định
        if (!currencyUnit) {
            alert('Cặp tiền này không được hỗ trợ.');
        }

        return currencyUnit;
    }

    function updateCurrencyPair() {
        const unit = getCurrencyUnit();
        const currencySelect = document.getElementById('hn-currencyPair');

        if (currencySelect) {
            const options = currencySelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.value === unit) {
                    currencySelect.value = unit;
                }
            });

            calculateLot();
        }
    }

    function addCopyAllButton() {
        // Tìm phần tử đích
        const targetDiv = document.querySelector('div[data-name="source-properties-editor"] > div[class^="footer-"] > div[class^="buttons-"]');

        // Tìm các trường nhập liệu
        const entryPriceInput = document.querySelector('input[data-property-id="Risk/RewardlongEntryPrice"], input[data-property-id="Risk/RewardshortEntryPrice"]');
        const profitPriceInput = document.querySelector('input[data-property-id="Risk/RewardlongProfitLevelPrice"], input[data-property-id="Risk/RewardshortProfitLevelPrice"]');
        const stopLevelInput = document.querySelector('input[data-property-id="Risk/RewardlongStopLevelPrice"], input[data-property-id="Risk/RewardshortStopLevelPrice"]');

        // Kiểm tra điều kiện: phần tử đích tồn tại, không có nút copy-all-btn và có ít nhất một entryPriceInput
        if (targetDiv && !targetDiv.querySelector('.hn-copy-all-btn') && entryPriceInput) {
            // Tạo nút copy-all-btn
            const copyAllBtn = document.createElement('button');
            copyAllBtn.className = 'hn-copy-all-btn';
            copyAllBtn.textContent = 'Tính Lot';
            targetDiv.insertBefore(copyAllBtn, targetDiv.firstChild);

            // Thêm sự kiện click cho nút
            copyAllBtn.addEventListener('click', () => {
                if (entryPriceInput && stopLevelInput) {
                    // Sao chép giá trị từ các trường nhập liệu
                    document.getElementById('hn-entryPrice').value = entryPriceInput.value;
                    document.getElementById('hn-profitPrice').value = profitPriceInput ? profitPriceInput.value : '';
                    document.getElementById('hn-stopLossPrice').value = stopLevelInput.value;

                    // Cập nhật cặp tiền tệ và thông báo
                    updateCurrencyPair();
                    document.getElementById('hn-alert').innerHTML = ''; // Xoá kết quả sao chép giá
                    // Hiện bảng tính
                    const lotCalculator = document.getElementById('hn-lotCalculator');
                    if (lotCalculator.style.display === 'none') {
                      lotCalculator.style.display = 'block'; // Hiển thị lại
                    }
                    // alert('Values copied to popup, currency pair updated, and calculation updated!');
                } else {
                    alert('Không tìm thấy trường dữ liệu!');
                }
            });
        }
    }

    // Run the function initially
    addCopyAllButton();

    // Observe DOM changes to dynamically add button to the target div
    const observer = new MutationObserver(addCopyAllButton);
    observer.observe(document.body, { childList: true, subtree: true });

    function copyToClipboard(value) {
        // Kiểm tra nếu value không rỗng
        if (value.trim() === '') {
            document.getElementById('hn-alert').innerHTML = '<p>Không có gì để sao chép.</p>';
            return;
        }

        navigator.clipboard.writeText(value).then(() => {
            document.getElementById('hn-alert').innerHTML = `<p>Đã sao chép: ${value}</p>`;
        }).catch(err => {
            document.getElementById('hn-alert').innerHTML = '<p>Lỗi khi sao chép.</p>';
        });
    }

    // Gán sự kiện
    document.getElementById('hn-lotForm').addEventListener('input', calculateLot);
    document.getElementById('hn-copyEntryPrice').addEventListener('click', () => {
        const entryPrice = document.getElementById('hn-entryPrice').value;
        copyToClipboard(entryPrice);
    });
    document.getElementById('hn-copyProfitPrice').addEventListener('click', () => {
        const profitPrice = document.getElementById('hn-profitPrice').value;
        copyToClipboard(profitPrice);
    });
    document.getElementById('hn-copyStopLossPrice').addEventListener('click', () => {
        const stopLossPrice = document.getElementById('hn-stopLossPrice').value;
        copyToClipboard(stopLossPrice);
    });
    // Ẩn hiện bảng tính
    document.getElementById('hn-closeButton').addEventListener('click', function() {
      const lotCalculator = document.getElementById('hn-lotCalculator');
      if (lotCalculator.style.display === 'none') {
          lotCalculator.style.display = 'block'; // Hiển thị lại
      } else {
          lotCalculator.style.display = 'none'; // Ẩn
      }
    });

    function savePosition() {
        const calculator = document.getElementById('hn-lotCalculator');
        if (calculator) {
            const position = {
                left: calculator.style.left,
                top: calculator.style.top
            };
            localStorage.setItem(LOT_POSITION_KEY, JSON.stringify(position));
        }
    }

    function loadPosition() {
        const savedPosition = localStorage.getItem(LOT_POSITION_KEY);
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            const calculator = document.getElementById('hn-lotCalculator');
            if (calculator) {
                calculator.style.left = position.left || '0px';
                calculator.style.top = position.top || '0px';
            }
        }
    }

    // Gán sự kiện lưu vị trí khi người dùng thả chuột
    document.addEventListener('mouseup', () => {
        savePosition();
    });

    // Gán sự kiện kéo thả form
    const draggable = document.getElementById('hn-lotCalculator');
    let isDragging = false;
    let offsetX, offsetY;

    draggable.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - draggable.getBoundingClientRect().left;
        offsetY = event.clientY - draggable.getBoundingClientRect().top;
        draggable.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            draggable.style.left = (event.clientX - offsetX) + 'px';
            draggable.style.top = (event.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        draggable.style.cursor = 'move';
        savePosition(); // Lưu vị trí khi thả chuột
    });

    async function initialize() {
        const data = getLocalData();

        if (data) {
            document.getElementById('hn-currencyPair').value = data.currencyPair || 'USD';
            document.getElementById('hn-capital').value = data.capital || '';
            document.getElementById('hn-riskPercentage').value = data.riskPercentage || '';
        }

        loadPosition(); // Khôi phục vị trí khi khởi tạo
    }

    initialize();

})();
