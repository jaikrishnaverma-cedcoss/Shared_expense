export function toTitleCase(str) {
    return str.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
}
export const noRef=(obj)=>JSON.parse(JSON.stringify(obj))
export const  regex = {
    nonNegativeIntFloat:/^[1-9]\d*$/
};

export function formatDate(date) {
    date = new Date(date);
    var day = date.getDate();
    var month = date.getMonth() + 1; // Month indexes are zero-based
    var year = date.getFullYear() % 100; // Get last two digits of the year
    var hours = date.getHours();
    var minutes = date.getMinutes();
  
    // Add leading zeros if necessary
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    if (year < 10) {
      year = "0" + year;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
  
    return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
  }
export const replaceAll = (str, from, to) => str.split(from).join(to);
export const reportCalculater = (transaction) => {

  const result = {
    contributers:[],
    pending_payments: {},
    created_payments: {},
    grand_total_expenses: 0,
  };
  transaction.forEach((tr) => {
    const { id: payer_id, name: payer_spaced_name } = tr.collaborators.find(
      (user) => tr.user_id == user.id
    );
    result.grand_total_expenses += parseFloat(tr.amount);
    const payer_name = replaceAll(payer_spaced_name, " ", "_");
    tr.collaborators.forEach((collab) => {
      const { id, name: spacedName, approved, transaction_type } = collab;
      const name = replaceAll(spacedName, " ", "_");
      const shared_amount = parseFloat(collab.shared_amount);
       if(result.created_payments?.[`${id}#${name}`]===undefined)
       result.created_payments[`${id}#${name}`]={
      total_spent:0,
      spent_on_self:0
      }
      if(!result.contributers.find(item=>item===`${id}#${name}`))
      result.contributers.push(`${id}#${name}`)
      if (transaction_type == "Cr") {
        result.created_payments[`${id}#${name}`].total_spent =
          (result.created_payments?.[`${id}#${name}`]?.total_spent ?? 0) +
          parseFloat(tr.amount);
        result.created_payments[`${id}#${name}`].spent_on_self=
          (result.created_payments?.[`${id}#${name}`]?.spent_on_self ?? 0) + shared_amount;
      } else if (transaction_type == "Dr") {
        result.created_payments[`${id}#${name}`].spent_on_self=
        (result.created_payments?.[`${id}#${name}`]?.spent_on_self ?? 0)  + shared_amount;
        // to send calculation
        const from_to = `${id}#${name}-to-${payer_id}#${payer_name}`;
        const to_from = `${payer_id}#${payer_name}-to-${id}#${name}`;
        result.pending_payments[from_to] =
          (result.pending_payments?.[from_to] ?? 0) + shared_amount;

        // normalize logic
        if (result.pending_payments?.[to_from]) {
          const user_amount = result.pending_payments?.[from_to];
          const other_user_amount = result.pending_payments?.[to_from];
          if (user_amount > other_user_amount) {
            result.pending_payments[from_to] =
              result.pending_payments[from_to] - result.pending_payments[to_from];
              result.pending_payments[to_from]=0
          } else if (other_user_amount > user_amount) {
            result.pending_payments[to_from] =
              result.pending_payments[to_from] - result.pending_payments[from_to];
              result.pending_payments[from_to]=0
          } else if(other_user_amount == user_amount) {
            result.pending_payments[from_to] = 0;
            result.pending_payments[to_from] = 0;
          }
        }
      }
    });
  });
  return result;
};