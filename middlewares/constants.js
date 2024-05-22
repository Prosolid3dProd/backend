const globals = Object.freeze({
  MODE_HORARIO: {
    TODAY: "today",
    YESTERDAY: "yesterday",
    THISWEEK: "thisweek",
    LASTWEEK: "lastweek",
    THISMONTH: "thismonth",
    LASTMONTH: "lastmonth",
  },
  DURATION_TYPE: {
    MONTHS: "months",
    DAYS: "days",
    M: "M",
    D: "d",
  },
  PACK: {
    KIND: {
      EVENT: "event",
      PRODUCT: "product",
      SUBSCRIPTION: "subscription",
      RENTAL: "rental",
    },
    CLASIFICATION: {
      EVENT: "event",
      TOUR: "tour",
      WORKSHOP: "workshop",
      MEETING: "meeting",
      PARTY: "party",
      CONFERENCE: "conference",
      SPACERENTAL: "spacerental",
      CARRENTAL: "carrental",
    },
  },
  PLAN: {
    STATUS: {
      OPEN: "open",
      CANCEL: "cancel",
      CLOSE: "close",
      INWAIT: "inwait",
    },
    PAYMENT_MODE: {
      CASH: "cash",
      DEBITCARD: "debitcard",
      CREDITCARD: "creditcard",
      TRANSFER: "transfer",
      OTHER: "other",
    },
    QUANTITY_GUEST: {
      NUMBER: 1000,
    },
    DURATION_MODE: {
      MONTHLY: "MONTHS",
    },
  },
  APP: {
    STATUS: {
      OPEN: "open",
      CANCEL: "cancel",
      CLOSE: "close",
      INWAIT: "inwait",
    },
    LIFECYCLE: {
      TO_BE_STARDED: "to-be-started",
      RECENTLY_STARTED: "recently-started",
      STARTED: "started",
      TO_BE_EXPIRED: "to-be-expired",
      EXPIRED: "expired",
      CANCELED: "canceled",
    },
  },
  EVENT: {
    TOUR: {
      MODE: {
        PUBLIC: "public",
      },
      DESCRIPTION: {
        tour_inwait: "Tour inwait",
      },
      PLAN_CODE_EMAIL_TEMPLATES: {
        tour_inwait: "tour_inwait",
        tour_approved: "tour_approved",
        tour_decline: "tour_decline",
        tour_payment: "tour_payment",
      },
      TITLE: {
        TICKET_APPROVED: "Ticket confirmado",
        TICKET_INWAIT: "Ticket en espera",
        TICKET_CANCEL: "Ticket anulado",
      },
    },
    SUBSCRIPTION: {
      MODE: {
        APP: "APP",
        PUBLIC: "public",
        PRIVATE: "private",
      },
      TITLE: {
        TICKET_APPROVED: "Ticket confirmado",
        TICKET_INWAIT: "Ticket en espera",
        TICKET_CANCEL: "Ticket anulado",
      },
      CATEGORY: {
        APP_APROVED: {
          CODE: "APP_APROVED",
          MESSAGE: "Aplicación aprobada",
        },
        APP_UPDATE: {
          CODE: "APP_UPDATE",
          MESSAGE: "Aplicación actualizada",
        },
        APP_INWAIT: {
          CODE: "APP_INWAIT",
          MESSAGE: "Aplicación en espera de aprobación",
        },
        APP_CANCEL: {
          CODE: "APP_CANCEL",
          MESSAGE: "Aplicación cancelada",
        },
        APP_CLOSE: {
          CODE: "APP_CLOSE",
          MESSAGE: "Aplicación cerrada",
        },
        PLAN_CREATE: {
          CODE: "PLAN_CREATE",
          MESSAGE: "Plan creado",
        },
        PLAN_INWAIT: {
          CODE: "PLAN_INWAIT",
          MESSAGE: "Plan en espera de aprobación",
        },
        PLAN_CANCEL: {
          CODE: "PLAN_CANCEL",
          MESSAGE: "Plan cancelado",
        },
        TRANS_CREATE: {
          CODE: "TRANS_CREATE",
          MESSAGE: "Se ha creado un nuevo pago",
        },
        TRANS_REVERSE: {
          CODE: "TRANS_REVERSE",
          MESSAGE: "El pago ha sido reversado.",
        },
        USER_CREATE_BY_WEBSITE_CONTACT: {
          CODE: "USER_CREATE_BY_WEBSITE_CONTACT",
          MESSAGE: "Nuevo registro de usuario desde el website.",
        },
        USER_NEW_SESSION: {
          CODE: "USER_NEW_SESSION",
          MESSAGE: "Inicio de sesion en el sistema.",
        },
        USER_LOGIN: {
          CODE: "USER_LOGIN",
          MESSAGE: "Inicio de sesion en el sistema.",
        },
        USER_NEW_DOWNLOAD: {
          CODE: "USER_NEW_DOWNLOAD",
          MESSAGE: "Descarga de reporte",
        },
        USER_CHECKIN: {
          CODE: "USER_CHECKIN",
          MESSAGE: "Ingreso cliente",
        },
        GUEST_CHECKIN: {
          CODE: "GUEST_CHECKIN",
          MESSAGE: "Ingreso Invitado",
        },
        TRANS_INVOICE: {
          CODE: "TRANS_INVOICE",
          MESSAGE: "Envio de comprobante de pago",
        },
        EXCEL_DOWNLOAD: {
          CODE: "EXCEL_DOWNLOAD",
          MESSAGE: "Descarga de reporte en Excel",
        },
        TRANS_INVOICE_VIEW_BY_USER: {
          CODE: "TRANS_INVOICE_VIEW_BY_USER",
          MESSAGE: "El comprobante de pago ha sido visualizado ",
        },
        USER_CHECKOUT: {
          CODE: "Salida",
          MESSAGE: "APP_APROVED",
        },
        USER_RATE: {
          CODE: "APP_RATE",
          MESSAGE: "El app ha sido calificada",
        },
        STATUS_CHANGED: "status_changed",
        APP_RENEW: "app_renew",
      },
    },
    TYPE: {
      TOUR: "TOUR",
      SUBSCRIPTION: "SUBSCRIPTION",
      GLOBAL: "GLOBAL",
      USER: "USER",
    },
    ICON: {
      SUCCESS: "SUCCESS",
      WARNING: "WARNING",
      ERROR: "ERROR",
      INFO: "INFO",
    },
  },
  TRANS: {
    TYPE: {
      INBOUND: "inbound",
      OUTBOUND: "outbound",
    },
    STATUS: {
      OPEN: "open",
      CANCEL: "cancel",
      CLOSE: "close",
      INWAIT: "inwait",
    },
    PAYMENT_MODE: {
      CASH: "cash",
      DEBITCARD: "debitcard",
      CREDITCARD: "creditcard",
      TRANSFER: "transfer",
      OTHER: "other",
    },
    PAYMENT_MODE_FORMAT: {
      cash: "efectivo",
      creditcard: "Tarjeta de Credito",
      debitcard: "Tarjeta de Debito",
      transfer: "Transferencía",
    },
  },
  AIRTABLE: {
    TABLES: {
      SECCIONES: "secciones",
      SOLICITUDES: "solicitudes",
      ELEMENTOS: "elementos",
      WEBSITECHANGES: "websitechanges",
      EVENTOS: "eventos",
      SERVICIOS: "servicios",
      PLANES: "planes",
      APLICACIONES: "aplicaciones",
      EMAILS: "emails",
    },
  },
});

module.exports = {
  globals,
};

/** */
