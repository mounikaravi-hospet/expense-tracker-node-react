import React, { useMemo } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * transactions: array of { amount: number|string, date: string (ISO), category: string }
 */
const Insights = ({ transactions = [] }) => {
  const now = new Date();
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  const {
    ytdThisYear,
    ytdLastYear,
    avgMonthlyThisYear,
    avgMonthlyLastYTD,
    topCategoryThisYear,
    topCategoryLastYTD,
    largestTxnThisYear,
    largestTxnLastYTD,
    pctChangeYTD,
    fullLastYear,
    avgMonthlyFullLast,
    topCategoryFullLast,
    largestTxnFullLast
  } = useMemo(() => {
    const startThisYear = new Date(thisYear, 0, 1);
    const startLastYear = new Date(lastYear, 0, 1);
    const endLastYearYTD = new Date(lastYear, now.getMonth(), now.getDate());
    const endLastYearFull = new Date(lastYear, 11, 31);

    let sumThis = 0, sumLastYTD = 0, sumLastFull = 0;
    const catThis = {}, catLastYTD = {}, catLastFull = {};
    let maxThis = { amount: 0, date: null, category: null };
    let maxLastYTD = { amount: 0, date: null, category: null };
    let maxLastFull = { amount: 0, date: null, category: null };

    transactions.forEach(t => {
      const amt = parseFloat(t.amount)||0;
      const d = new Date(t.date);
      if (d >= startThisYear && d <= now) {
        sumThis += amt;
        catThis[t.category] = (catThis[t.category]||0) + amt;
        if (amt > maxThis.amount) maxThis = { amount: amt, date: d, category: t.category };
      }
      if (d >= startLastYear && d <= endLastYearYTD) {
        sumLastYTD += amt;
        catLastYTD[t.category] = (catLastYTD[t.category]||0) + amt;
        if (amt > maxLastYTD.amount) maxLastYTD = { amount: amt, date: d, category: t.category };
      }
      if (d >= startLastYear && d <= endLastYearFull) {
        sumLastFull += amt;
        catLastFull[t.category] = (catLastFull[t.category]||0) + amt;
        if (amt > maxLastFull.amount) maxLastFull = { amount: amt, date: d, category: t.category };
      }
    });

    const pctChange = sumLastYTD>0 ? ((sumThis-sumLastYTD)/sumLastYTD)*100 : null;
    const monthsElapsed = now.getMonth()+1;
    const avgThis = monthsElapsed ? sumThis/monthsElapsed : 0;
    const avgLastYTD = monthsElapsed ? sumLastYTD/monthsElapsed : 0;
    const avgLastFull = 12 ? sumLastFull/12 : 0;

    const findTop = obj => {
      let cat=null, amt=0;
      Object.entries(obj).forEach(([c,s])=>{ if(s>amt){amt=s;cat=c;} });
      return { category:cat, amount:amt };
    };

    const topThis = findTop(catThis);
    const topYTD = findTop(catLastYTD);
    const topFull = findTop(catLastFull);

    return {
      ytdThisYear: sumThis,
      ytdLastYear: sumLastYTD,
      avgMonthlyThisYear: avgThis,
      avgMonthlyLastYTD: avgLastYTD,
      topCategoryThisYear: topThis.category,
      topCategoryLastYTD: topYTD.category,
      largestTxnThisYear: maxThis,
      largestTxnLastYTD: maxLastYTD,
      pctChangeYTD: pctChange,
      fullLastYear: sumLastFull,
      avgMonthlyFullLast: avgLastFull,
      topCategoryFullLast: topFull.category,
      largestTxnFullLast: maxLastFull
    };
  }, [transactions]);

  const fmt = d => d? d.toLocaleDateString():"N/A";
  const sumCatYear = (cat,yr) => transactions
    .filter(t=>t.category===cat && new Date(t.date).getFullYear()===yr)
    .reduce((a,t)=>a+parseFloat(t.amount)||0,0).toFixed(2);

  return (
    <>
      {/* Comparison Card for YTD */}
      <Card border="primary" className="mt-3 mb-3">
        <Card.Header as="h4">Year‑to‑Date Comparison</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <h5>{thisYear}</h5>
              <p><strong>Spending:</strong> ${ytdThisYear.toFixed(2)}</p>
              <p><strong>Avg Monthly:</strong> ${avgMonthlyThisYear.toFixed(2)}</p>
              <p><strong>Top Category:</strong> {topCategoryThisYear||"N/A"} {topCategoryThisYear?`($${sumCatYear(topCategoryThisYear,thisYear)})`:''}</p>
              <p><strong>Largest Txn:</strong> ${largestTxnThisYear.amount.toFixed(2)} on {fmt(largestTxnThisYear.date)}</p>
            </Col>
            <Col>
              <h5>{lastYear}</h5>
              <p><strong>Spending:</strong> ${ytdLastYear.toFixed(2)}</p>
              <p><strong>Avg Monthly:</strong> ${avgMonthlyLastYTD.toFixed(2)}</p>
              <p><strong>Top Category:</strong> {topCategoryLastYTD||"N/A"} {topCategoryLastYTD?`($${sumCatYear(topCategoryLastYTD,lastYear)})`:''}</p>
              <p><strong>Largest Txn:</strong> ${largestTxnLastYTD.amount.toFixed(2)} on {fmt(largestTxnLastYTD.date)}</p>
            </Col>
          </Row>
          {pctChangeYTD!==null && <p className="mt-3"><strong>YoY Change:</strong> {pctChangeYTD.toFixed(1)}%</p>}
        </Card.Body>
      </Card>

      {/* Full last year card unchanged */}
      <Card border="secondary" className="mb-3">
        <Card.Header as="h4">Insights — {lastYear} (Full Year)</Card.Header>
        <Card.Body>
          <p><strong>Total Spending:</strong> ${fullLastYear.toFixed(2)}</p>
          <p><strong>Avg Monthly:</strong> ${avgMonthlyFullLast.toFixed(2)}</p>
          <p><strong>Top Category:</strong> {topCategoryFullLast||"N/A"} {topCategoryFullLast?`($${sumCatYear(topCategoryFullLast,lastYear)})`:''}</p>
          <p><strong>Largest Txn:</strong> ${largestTxnFullLast.amount.toFixed(2)} on {fmt(largestTxnFullLast.date)}</p>
        </Card.Body>
      </Card>
    </>
  );
};

export default Insights;
