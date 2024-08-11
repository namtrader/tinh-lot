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
                            <option value="USD">xxxUSD,US30</option>
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
                <div class="hn-exchange-rate-container">
                    <span id="hn-exchangeRate">0.00</span>
                    <button type="button" id="hn-reloadExchangeRate" title="Tải lại tỷ giá với USD">
                        <!-- SVG Refresh Icon -->
                        <svg fill="#FFFFFF" height="24px" width="24px" version="1.1" id="hn-Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 489.698 489.698" xml:space="preserve">
                            <g>
                                <g>
                                    <path d="M468.999,227.774c-11.4,0-20.8,8.3-20.8,19.8c-1,74.9-44.2,142.6-110.3,178.9c-99.6,54.7-216,5.6-260.6-61l62.9,13.1c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1,3.5-23.9,22.9l15.6,124.8c1,10.4,9.4,17.7,19.8,17.7c15.5,0,21.8-11.4,20.8-22.9l-7.3-60.9c101.1,121.3,229.4,104.4,306.8,69.3c80.1-42.7,131.1-124.8,132.1-215.4C488.799,237.174,480.399,227.774,468.999,227.774z"/>
                                    <path d="M20.599,261.874c11.4,0,20.8-8.3,20.8-19.8c1-74.9,44.2-142.6,110.3-178.9c99.6-54.7,216-5.6,260.6,61l-62.9-13.1c-10.4-2.1-21.8,4.2-23.9,15.6c-2.1,10.4,4.2,21.8,15.6,23.9l123.8,26c7.2,1.7,26.1-3.5,23.9-22.9l-15.6-124.8c-1-10.4-9.4-17.7-19.8-17.7c-15.5,0-21.8,11.4-20.8,22.9l7.2,60.9c-101.1-121.2-229.4-104.4-306.8-69.2c-80.1,42.6-131.1,124.8-132.2,215.3C0.799,252.574,9.199,261.874,20.599,261.874z"/>
                                </g>
                            </g>
                        </svg>
                    </button>
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
        #hn-copyEntryPrice, #hn-copyProfitPrice, #hn-copyStopLossPrice, #hn-reloadExchangeRate {
            margin-top: 5px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #hn-copyEntryPrice:hover, #hn-copyProfitPrice:hover, #hn-copyStopLossPrice:hover, #hn-reloadExchangeRate:hover, .hn-copy-all-btn:hover {
            background-color: #0056b3;
        }
        .hn-copy-all-btn {
            padding: 6px;
            margin-right: 10px;
            border-radius: 6px;
            background-color: #007bff;
            color: white;
        }
        .hn-exchange-rate-container {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 13px;
        }

        #hn-exchangeRate {
            margin-right: 5px;
            font-size: 13px;
        }

        #hn-reloadExchangeRate {
            background: none;
            border: none;
            cursor: pointer;
        }

        #hn-reloadExchangeRate svg {
            fill: #ffffff;
            height: 13px;
            width: 13px;
        }

        #hn-reloadExchangeRate:hover svg {
            fill: #cccccc;
        }
    `;
    document.head.appendChild(style);

    const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
    const CACHE_KEY = 'tradingData';
    const DATE_KEY = 'lastUpdateDate';
    const STORAGE_KEY = 'lotCalculatorPosition';

    async function fetchExchangeRate() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                ...getLocalData(),
                exchangeRates: data.rates
            }));
            const currentDate = new Date().toISOString().split('T')[0];
            localStorage.setItem(DATE_KEY, currentDate);

            return data.rates;
        } catch (error) {
            console.error('Lỗi khi lấy tỷ giá:', error);
            return null;
        }
    }

    function getLocalData() {
        const storedData = localStorage.getItem(CACHE_KEY);
        return storedData ? JSON.parse(storedData) : {};
    }

    function updateExchangeRateField(rates) {
        const pair = document.getElementById('hn-currencyPair').value;
        const exchangeRate = rates[pair];
        document.getElementById('hn-exchangeRate').textContent = exchangeRate ? exchangeRate.toFixed(2) : '';
    }

    async function reloadExchangeRate() {
        const exchangeRates = await fetchExchangeRate();
        if (exchangeRates) {
            updateExchangeRateField(exchangeRates);
        }
    }

    function updateExchangeRate() {
        const data = getLocalData();
        if (data.exchangeRates) {
            updateExchangeRateField(data.exchangeRates);
        }
    }

    function displayResult(title, pipRisk, pipValueUSD, lotSize, maxRiskUSD) {
        const minLotSize = 0.01;

        // Tính toán kích thước lot nửa trước
        const halfLotSize = Math.max(lotSize / 2, minLotSize);
        // Đảm bảo lotSize không nhỏ hơn minLotSize
        lotSize = Math.max(lotSize, minLotSize);

        document.getElementById('hn-result').innerHTML = `
            <h2>${title}</h2>
            <p>Lot: <span style="color:red">${lotSize.toFixed(2)}</span> (Chia đôi: <span style="color:red">${halfLotSize.toFixed(2)}</span>)</p>
            <p>Số USD SL: ${maxRiskUSD.toFixed(2)}</p>
            <p>Số Pip SL: ${pipRisk.toFixed(1)}</p>
        `;
        console.log('%c' + pipValueUSD, 'color: blue;'); // Debug
    }

    function calculateLot() {
        const data = getLocalData();
        const exchangeRates = data.exchangeRates;

        if (!exchangeRates) {
            document.getElementById('hn-result').innerHTML = '<p>Lỗi khi lấy tỷ giá. Vui lòng thử lại sau.</p>';
            return;
        }

        const capital = parseFloat(document.getElementById('hn-capital').value);
        const riskPercentage = parseFloat(document.getElementById('hn-riskPercentage').value);
        const entryPrice = parseFloat(document.getElementById('hn-entryPrice').value);
        const stopLossPrice = parseFloat(document.getElementById('hn-stopLossPrice').value);
        const pair = document.getElementById('hn-currencyPair').value;
        const exchangeRate = exchangeRates[pair];

        localStorage.setItem(CACHE_KEY, JSON.stringify({
            ...data,
            currencyPair: pair,
            capital,
            riskPercentage
        }));

        const maxRiskUSD = (capital * riskPercentage) / 100;
        const pipSize = (pair === 'JPY') ? 0.01 : 0.0001;
        const isGoldOil = ['XAU', 'XTI'].includes(pair);
        const isBTC = pair === 'BTC';

        let pipRisk, pipValueUSD, lotSize;

        if (isGoldOil) {
            pipRisk = Math.abs(entryPrice - stopLossPrice) / 0.01;
            pipValueUSD = 1;
            lotSize = maxRiskUSD / (pipRisk * pipValueUSD);
            displayResult(pair === 'XAU' ? `Vàng ${pair}` : `Dầu ${pair}`, pipRisk, pipValueUSD, lotSize, maxRiskUSD);
        } else if (isBTC) {
            pipRisk = Math.abs(entryPrice - stopLossPrice);
            lotSize = maxRiskUSD / pipRisk;
            displayResult('Bitcoin', pipRisk, 0, lotSize, maxRiskUSD);
        } else {
            if (!exchangeRate) {
                document.getElementById('hn-result').innerHTML = '<p>Tỷ giá không hợp lệ. Vui lòng kiểm tra lại.</p>';
                return;
            }

            pipRisk = Math.abs(entryPrice - stopLossPrice) / pipSize;
            pipValueUSD = pipSize * 100000 / exchangeRate;
            lotSize = maxRiskUSD / (pipRisk * pipValueUSD);
            displayResult(`Cặp Tiền ${pair}`, pipRisk, pipValueUSD, lotSize, maxRiskUSD);
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
        if (textContent === 'XAUUSD') {
            return 'XAU';
        } else if (textContent === 'BTCUSD' || textContent === 'BTCUSDT') {
            return 'BTC';
        } else if (textContent === 'XTIUSD') {
            return 'XTI';
        } else if (textContent.endsWith('USD')) {
            return 'USD';
        } else if (textContent.endsWith('JPY')) {
            return 'JPY';
        } else if (textContent.endsWith('CAD')) {
            return 'CAD';
        } else if (textContent.endsWith('AUD')) {
            return 'AUD';
        } else if (textContent.endsWith('GBP')) {
            return 'GBP';
        } else if (textContent.endsWith('NZD')) {
            return 'NZD';
        } else if (textContent.endsWith('CHF')) {
            return 'CHF';
        } else {
            // Nếu không khớp với bất kỳ trường hợp nào, trả về một giá trị mặc định
            return '';
        }
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

            // Cập nhật tỷ giá và tính toán lại ngay lập tức
            updateExchangeRate();
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
        navigator.clipboard.writeText(value).then(() => {
            document.getElementById('hn-alert').innerHTML = `<p>Đã sao chép: ${value}</p>`;
        }).catch(err => {
            document.getElementById('hn-alert').innerHTML = '<p>Lỗi khi sao chép.</p>';
        });
    }

    // Gán sự kiện
    document.getElementById('hn-reloadExchangeRate').addEventListener('click', reloadExchangeRate);
    document.getElementById('hn-lotForm').addEventListener('input', calculateLot);
    document.getElementById('hn-currencyPair').addEventListener('change', updateExchangeRate);
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
        }
    }

    function loadPosition() {
        const savedPosition = localStorage.getItem(STORAGE_KEY);
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            const calculator = document.getElementById('hn-lotCalculator');
            if (calculator) {
                calculator.style.left = position.left || '0px';
                calculator.style.top = position.top || '0px';
            }
        }
    }

    async function initialize() {
        const data = getLocalData();

        const lastUpdateDate = localStorage.getItem(DATE_KEY);
        const currentDate = new Date().toISOString().split('T')[0];

        if (lastUpdateDate !== currentDate || !data.exchangeRates) {
            // Nếu ngày lưu trữ khác ngày hiện tại hoặc không có dữ liệu tỷ giá, tải tỷ giá và cập nhật
            const exchangeRates = await fetchExchangeRate();
            if (exchangeRates) {
                updateExchangeRateField(exchangeRates);
            }
        } else {
            // Nếu tỷ giá đã được cập nhật trong ngày hiện tại, lấy từ localStorage
            updateExchangeRateField(data.exchangeRates);
        }

        if (data) {
            document.getElementById('hn-currencyPair').value = data.currencyPair || 'USD';
            document.getElementById('hn-capital').value = data.capital || '';
            document.getElementById('hn-riskPercentage').value = data.riskPercentage || '';
            document.getElementById('hn-exchangeRate').textContent = data.exchangeRates ? data.exchangeRates[data.currencyPair] || '' : '';
        }

        loadPosition(); // Khôi phục vị trí khi khởi tạo
        updateExchangeRate();
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

    initialize();

})();
