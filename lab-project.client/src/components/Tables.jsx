import React from 'react';

function Tables() {
  return (
    <div style={{ padding: '0 50px' }}> {/* Duhet me ndreq qe mu kon ngjyra ndryshe ne padding si ne demo */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', border: '1px solid #f1f5f9' }}> {/* ngjyra si e background  */}
          <colgroup>
            <col style={{ width: '5%' }} /> {/* Kjo i kontrollon images te produktet - mu zavendesu me databaze ne backend */}
            <col style={{ width: '45%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <tbody>
            {/* Rreshti 1 */}
            <tr style={{ borderBottom: '1px solid #f1f5f9', height: '80px' }}>
              <td colSpan="5" style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '20px' }}>Top Products</td>
            </tr>
            {/* Rreshti 2 */}
            <tr style={{ color: 'darkblue', borderBottom: '1px solid #f1f5f9', height: '60px'}}>
              <td></td>
              <td>Product Name</td>
              <td>Category</td>
              <td>Price</td>
              <td>Sold</td>
              <td>Profit</td>
            </tr>
            {/* Rreshti 3 */}
            <tr style={{ borderBottom: '1px solid #f1f5f9', height: '90px' }}>
              <td><img src="src/components/images/product-01.png" alt="Product1" /></td>
              <td>Apple Watch Series 7</td>
              <td>Electronics</td>
              <td>$269</td>
              <td>22</td>
              <td style={{ color: 'green' }}>$45</td>
            </tr>
            {/* Rreshti 4 */}
            <tr style={{ borderBottom: '1px solid #f1f5f9', height: '90px' }}>
              <td><img src="src/components/images/product-02.png" alt="Product2"/></td>
              <td>Macbook Pro M1</td>
              <td>Electronics</td>
              <td>$546</td>
              <td>34</td>
              <td style={{ color: 'green' }}>$125</td>
            </tr>
            {/* Rreshti 5 */}
            <tr style={{ borderBottom: '1px solid #f1f5f9', height: '90px' }}>
              <td><img src="src/components/images/product-03.png" alt="Product3"/></td>
              <td>Dell Inspiron 15</td>
              <td>Electronics</td>
              <td>$443</td>
              <td>64</td>
              <td style={{ color: 'green' }}>$247</td>
            </tr>
            {/* Rreshti 6 */}
            <tr style={{ borderBottom: '1px solid #f1f5f9', height: '90px' }}>
              <td><img src="src/components/images/product-04.png" alt="Product4"/></td>
              <td>HP Probook 450</td>
              <td>Electronics</td>
              <td>$499</td>
              <td>72</td>
              <td style={{ color: 'green' }}>$103</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tables;