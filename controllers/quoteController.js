const { connect, disconnect } = require("../models/db");
const { syncUsersAirtable } = require("./AirTableUserController");

const Quotation = require("../models/Quotation");
const Quote = require("../models/Quote");
const Product = require("../models/Product");

const quoteCalculate = async (quotationId) => {
  // aqui se obtienen informacion del presupuesto en general

  let totalGeneral = 0;

  const quotesResult = await Quote.find({
    quotationId: quotationId,
    archived: null,
  }).populate("quotationId");

  let contador = 0;

  quotesResult.forEach(async (element) => {
    contador = contador + 1;
    let total = 0;
    let pts = 0;
    let variants = 0;
    let ptsVariant = 0;
    let rechargePorcentage = 0;
    let recharge = 0;
    let ptsCabinet = parseFloat(element.ptos) || 0;
    let widthQuote;
    let quoteTypeFrame;
    let cabinetMode;
    const coefficient = 1; // parseFloat(coefficient_) || 1;

    const product = await Product.findOne({
      _id: element.base._id,
    });

    if (product) {
      if (product.quoteType === 1) {
        total = parseFloat(product.pts) * coefficient;
        pts = parseFloat(product.pts);

        element.variants.forEach(async (element2) => {
          if (element2.pts && element2.active === true) {
            total = total + parseFloat(element2.pts || 0) * coefficient;
            pts = parseFloat(pts) + parseFloat(element2.pts || 0);
            ptsVariant = ptsVariant + parseFloat(element2.pts || 0);
            variants = ptsVariant + parseFloat(element2.pts || 0) * coefficient;
          }
        });

        totalGeneral = totalGeneral + total;
        await Quote.findByIdAndUpdate(
          {
            _id: element._id,
          },
          {
            quote: {
              ptsCabinet: pts,
              pts,
              variants,
              ptsVariant,
              total,
              recharge: 0,
              coefficient,
              rechargePorcentage: 0,
              group: null,
              groupCoefficient: null,
              option: null,
              priceComponent: 0,
              groupName: null,
              ptsComponent: 0,
              price: pts,
              priceDoor: 0,
              ptsDoor: 0,
            },
          }
        );
      }

      // validamos el tipo de tarifa del mueble, 3 es avanzada
      if (product.quoteType === 3) {
        let option;

        if (String(product.variableQuote).toUpperCase() === "WIDTH") {
          option = element.size.width || element.width;
        } else if (String(product.variableQuote).toUpperCase() === "HEIGHT") {
          option = element.size.height || element.height;
        } else if (String(product.variableQuote).toUpperCase() === "DEPTH") {
          option = element.size.depth || element.depth;
        } else {
          option = element.size.width || element.width;
        }

        if (!option) {
          console.log("no hay opcion", element.base.name);
        } else {
          let finalValue = false;
          element.base.quotesList.forEach((element3) => {
            if (element3.option === option && !finalValue) {
              ptsCabinet = parseFloat(element3.pts) || 0;
              widthQuote = element3;
              finalValue = true;
            } else if (element3.option >= option && !finalValue) {
              finalValue = true;
              widthQuote = element3;
              ptsCabinet = parseFloat(element3.pts) || 0;
              especial = true;
            }
          });
        }

        total = parseFloat(ptsCabinet) * coefficient;

        pts = ptsCabinet;
        // validamos si el mueble tiene recargo por armazon
        if (element.elements && element.elements.frame) {
          rechargePorcentage = element.elements.frame.recharge;
          quoteTypeFrame = element.elements.frame.quoteType;
          cabinetMode = element.elements.frame.mode;
        }

        element.variants.forEach(async (element2) => {
          if (element2.pts && element2.active === true) {
            total = total + parseFloat(element2.pts || 0) * coefficient;
            pts = parseFloat(pts) + parseFloat(element2.pts || 0);
            ptsVariant = ptsVariant + parseFloat(element2.pts || 0);
            variants = ptsVariant + parseFloat(element2.pts || 0) * coefficient;
          }
        });

        // validamos subcomponentes
        let totalChildrens = 0;
        let quantityChildrens = 0;
        const namesChildrens = [];

        const quotesChildrens = await Quote.find({
          fatherId: element._id,
          archived: null,
        });

        // si contiene subcomponentes ingresa aqui
        if (quotesChildrens) {
          quotesChildrens.forEach((element4) => {
            totalChildrens =
              totalChildrens + parseFloat(element4.quote?.total || 0);
            quantityChildrens = 1 + parseFloat(quantityChildrens);
            namesChildrens.push(element4.base?.name);
          });

          await Quote.findByIdAndUpdate(
            {
              _id: element._id,
            },
            {
              childrens: {
                totalChildrens,
                quantityChildrens,
                namesChildrens,
              },
            }
          );
        }

        // recarga el mueble basado en el precio en el material del casco
        if (
          rechargePorcentage > 0 &&
          quoteTypeFrame === "recargo" &&
          cabinetMode === "cabinet"
        ) {
          recharge = (total * rechargePorcentage) / 100;
          total = parseFloat(total) + parseFloat(recharge);
        }

        totalGeneral = totalGeneral + total + totalChildrens;
        await Quote.findByIdAndUpdate(
          {
            _id: element._id,
          },
          {
            quote: {
              quantity: element.quantity || 1,
              ptsCabinet,
              pts,
              variants,
              ptsVariant,
              totalByUnit: parseFloat(
                parseFloat(total) + parseFloat(totalChildrens)
              ),
              total:
                parseFloat(parseFloat(total) + parseFloat(totalChildrens)) *
                parseInt(element.quantity || 1),
              totalChildrens,
              totalCabinet: total,
              recharge,
              coefficient,
              rechargePorcentage,
              group: widthQuote?.group || null,
              groupCoefficient: widthQuote?.groupCoefficient || 1,
              option: widthQuote?.option || null,
              priceComponent: 0,
              groupName: widthQuote?.groupName,
              ptsComponent: 0,
              price: 0,
              priceDoor: 0,
              ptsDoor: 0,
            },
          }
        );

        if (quotesResult.length === contador) {
          await actualizacionTotalGeneral({ total: totalGeneral, quotationId });
        }
      }
    }
  });

  /// calculo de totales generales
};

const actualizacionTotalGeneral = async ({ total, quotationId }) => {
  const tax = total * 0.21;

  await Quotation.findByIdAndUpdate(
    { _id: quotationId },
    {
      importe: parseFloat(total).toFixed(2),
      total: parseFloat(parseFloat(total) + parseFloat(tax)).toFixed(2),
      tax: parseFloat(tax).toFixed(2),
    },
    { new: true }
  );

  return true;
};

const totalQuotation = async (quotationId) => {
  try {
    const resultQuotes = await Quote.find({ quotationId });

    console.log(resultQuotes.length);
    let totalQuotation = 0;
    const promises = resultQuotes.map(async (quote) => {
      let total = quote.tarifa?.ptos;

      const resultQuote = await Quote.findOne({ _id: quote._id });

      if (resultQuote) {
        resultQuote.variants &&
          resultQuote.variants.map(async (variant) => {
            if (variant.active !== false) {
              total = parseFloat(variant.pts) + total;
            }
          });

        totalQuotation += total;
      }
    });

    /// actualizar quotation con el total

    // Wait for all promises to resolve using Promise.all
    await Promise.all(promises);

    console.log("totalQuotation: ", totalQuotation);

    const res = await Quotation.findOneAndUpdate(
      { _id: quotationId },
      { total: totalQuotation }
    );

    return res;
  } catch (error) {
    console.log(error);
  } finally {
  }
};

const totalQuote = async (quoteId) => {
  try {
    const resultQuote = await Quote.findOne({ _id: quoteId });

    let totalQuotation = 0;
    let total = 0;

    if (resultQuote) {
      resultQuote.variants.map(async (variant) => {
        if (variant.active !== false) {
          total = parseFloat(variant.pts) + total;
        }
      });

      totalQuotation += total;
    }

    /// actualizar quotation con el total

    // Wait for all promises to resolve using Promise.all
    await Promise.all(promises);

    console.log("totalQuotation: ", totalQuotation);

    const res = await Quotation.findOneAndUpdate(
      { _id: quotationId },
      { total: totalQuotation }
    );

    return res;
  } catch (error) {
    console.log(error);
  } finally {
  }
};

module.exports = {
  quoteCalculate,
  totalQuotation,
};
